import paramiko
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

HOST = "130.49.148.253"
USER = "root"
PASSWORD = "dvfHuqlxyO5mh6o2"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd, timeout=600):
    print(f"\n> {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        lines = out.split('\n')
        for line in lines[-15:]:
            print(f"  {line}", flush=True)
        if len(lines) > 15:
            print(f"  ... ({len(lines)} total lines)", flush=True)
    if err and exit_code != 0:
        for line in err.split('\n')[-5:]:
            print(f"  ERR: {line}", flush=True)
    if exit_code != 0:
        print(f"  [EXIT CODE: {exit_code}]", flush=True)
    return out, err, exit_code

print("=== CONTINUING DEPLOYMENT ===", flush=True)

print("\n" + "=" * 60, flush=True)
print("STEP 6: npm install + build", flush=True)
print("=" * 60, flush=True)
out, err, code = run("cd /root/malibourse-app && npm run build", timeout=300)
if code != 0:
    print(f"\nBuild failed with exit code {code}", flush=True)
    # Try to see what happened
    run("cd /root/malibourse-app && ls -la .next/ 2>/dev/null || echo 'No .next directory'")

print("\n" + "=" * 60)
print("STEP 7: Start app with PM2")
print("=" * 60)
run("cd /root/malibourse-app && pm2 start npm --name malibourse -- start")
run("pm2 save")
run("pm2 startup systemd -u root --hp /root")

print("\n" + "=" * 60)
print("STEP 8: Configure Nginx")
print("=" * 60)
run("echo 'server {' > /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '    listen 80;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '    server_name etudiantsmali.ru www.etudiantsmali.ru;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '    location / {' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_pass http://localhost:3000;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_http_version 1.1;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header Upgrade \\$http_upgrade;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header Connection upgrade;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header Host \\$host;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_cache_bypass \\$http_upgrade;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header X-Real-IP \\$remote_addr;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '        proxy_set_header X-Forwarded-Proto \\$scheme;' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '    }' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("echo '}' >> /etc/nginx/sites-available/etudiantsmali.ru")
run("ln -sf /etc/nginx/sites-available/etudiantsmali.ru /etc/nginx/sites-enabled/")
run("rm -f /etc/nginx/sites-enabled/default")
run("nginx -t")
run("systemctl reload nginx")

print("\n" + "=" * 60)
print("STEP 9: Verify")
print("=" * 60)
run("pm2 list")
run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/")

print("\n" + "=" * 60)
print("DEPLOYMENT COMPLETE!")
print("=" * 60)
print(f"\nApp: http://130.49.148.253")
print(f"Domain: http://etudiantsmali.ru (after DNS update)")

ssh.close()
