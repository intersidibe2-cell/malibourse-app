import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('130.49.148.253', 22, 'root', 'dvfHuqlxyO5mh6o2', timeout=30)

def run(cmd, timeout=60):
    print(f"> {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        for line in out.split('\n')[-10:]:
            print(f"  {line}", flush=True)
    if exit_code != 0 and err:
        for line in err.split('\n')[-5:]:
            print(f"  ERR: {line}", flush=True)
    return out, exit_code

# Upload fix script via SFTP
sftp = ssh.open_sftp()
with sftp.open("/tmp/fix_nginx.py", "w") as f:
    f.write("""
import os

config = """server {
    listen 80;
    server_name etudiantsmali.ru www.etudiantsmali.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}"""

with open('/etc/nginx/sites-available/etudiantsmali.ru', 'w') as f:
    f.write(config)
print('Nginx config rewritten OK')
""")
sftp.close()
print("Script uploaded")

run("python3 /tmp/fix_nginx.py")
out, code = run("nginx -t")
print(f"nginx test: {out}")

run("systemctl reload nginx")

import time
time.sleep(3)

out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ -H 'Host: etudiantsmali.ru'")
print(f"Nginx proxy status: {out}")

out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/")
print(f"App port 3000 status: {out}")

out, code = run("pm2 logs malibourse --lines 5 --nostream")
print(f"PM2 logs: {out}")

ssh.close()
