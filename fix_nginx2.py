import paramiko
import sys
import io
import time

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
        for line in out.split('\n')[-5:]:
            print(f"  {line}", flush=True)
    if exit_code != 0 and err:
        for line in err.split('\n')[-3:]:
            print(f"  ERR: {line}", flush=True)
    return out, exit_code

# Upload fix script via SFTP
sftp = ssh.open_sftp()
nginx_config = "server {\n"
nginx_config += "    listen 80;\n"
nginx_config += "    server_name etudiantsmali.ru www.etudiantsmali.ru;\n"
nginx_config += "\n"
nginx_config += "    location / {\n"
nginx_config += "        proxy_pass http://localhost:3000;\n"
nginx_config += "        proxy_http_version 1.1;\n"
nginx_config += "        proxy_set_header Upgrade $http_upgrade;\n"
nginx_config += "        proxy_set_header Connection 'upgrade';\n"
nginx_config += "        proxy_set_header Host $host;\n"
nginx_config += "        proxy_cache_bypass $http_upgrade;\n"
nginx_config += "        proxy_set_header X-Real-IP $remote_addr;\n"
nginx_config += "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n"
nginx_config += "        proxy_set_header X-Forwarded-Proto $scheme;\n"
nginx_config += "    }\n"
nginx_config += "}\n"

with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write(nginx_config)
print("Nginx config uploaded via SFTP", flush=True)
sftp.close()

run("ln -sf /etc/nginx/sites-available/etudiantsmali.ru /etc/nginx/sites-enabled/")
run("rm -f /etc/nginx/sites-enabled/default")
out, code = run("nginx -t")
print(f"nginx test: {out}")

run("systemctl reload nginx")

time.sleep(3)

out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/")
print(f"Port 3000: {out}")

out, code = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ -H 'Host: etudiantsmali.ru'")
print(f"Port 80 (nginx): {out}")

run("pm2 logs malibourse --lines 3 --nostream")

ssh.close()
print("\nDone!")
