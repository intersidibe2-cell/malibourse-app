import paramiko
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('130.49.148.253', 22, 'root', 'dvfHuqlxyO5mh6o2', timeout=30)
print('Connected!', flush=True)

def run(cmd, timeout=60):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(f'  {out[:200]}', flush=True)
    if exit_code != 0 and err:
        print(f'  ERR: {err[:200]}', flush=True)
    return out, exit_code

# Fix Nginx config via SFTP
sftp = ssh.open_sftp()
with sftp.open('/etc/nginx/sites-available/etudiantsmali.ru', 'w') as f:
    f.write('server {\n')
    f.write('    listen 80;\n')
    f.write('    server_name etudiantsmali.ru www.etudiantsmali.ru;\n')
    f.write('\n')
    f.write('    location / {\n')
    f.write('        proxy_pass http://localhost:3000;\n')
    f.write('        proxy_http_version 1.1;\n')
    f.write('        proxy_set_header Upgrade $http_upgrade;\n')
    f.write("        proxy_set_header Connection 'upgrade';\n")
    f.write('        proxy_set_header Host $host;\n')
    f.write('        proxy_cache_bypass $http_upgrade;\n')
    f.write('        proxy_set_header X-Real-IP $remote_addr;\n')
    f.write('        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n')
    f.write('        proxy_set_header X-Forwarded-Proto $scheme;\n')
    f.write('    }\n')
    f.write('}\n')
sftp.close()
print('Nginx config written correctly!', flush=True)

# Test and reload
out, code = run('nginx -t')
print(f'nginx test: {out}', flush=True)

run('systemctl reload nginx')
print('Nginx reloaded', flush=True)

# Restart app
run('pm2 restart malibourse')
print('PM2 restarted', flush=True)

time.sleep(3)

# Test HTTP
out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ -H 'Host: etudiantsmali.ru'")
print(f'HTTP status: {out}', flush=True)

# Test port 3000
out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/")
print(f'Port 3000 status: {out}', flush=True)

run('pm2 list')

ssh.close()
print('Done!', flush=True)
