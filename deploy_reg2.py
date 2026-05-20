import paramiko
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
    try:
        stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
        exit_code = stdout.channel.recv_exit_status()
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out:
            lines = out.split('\n')
            for line in lines[-15:]:
                print(f"  {line}", flush=True)
        if err and exit_code != 0:
            for line in err.split('\n')[-5:]:
                print(f"  ERR: {line}", flush=True)
        if exit_code != 0:
            print(f"  [EXIT CODE: {exit_code}]", flush=True)
        return out, err, exit_code
    except Exception as e:
        print(f"  ERROR: {e}", flush=True)
        return "", str(e), 1

print("Connecting to Reg.ru server...", flush=True)
ssh.connect(HOST, 22, USER, PASSWORD, look_for_keys=False, allow_agent=False, timeout=30)
print("Connected!\n", flush=True)

# Check what's already installed
print("=" * 60)
print("CHECK: Verify what's already done")
print("=" * 60)
run("node -v")
run("npm -v")
run("ls /root/malibourse-app/.env.production 2>/dev/null && cat /root/malibourse-app/.env.production")
run("ls /root/malibourse-app/.next/BUILD_ID 2>/dev/null || echo 'No build yet'")

# Run npm build
print("\n" + "=" * 60)
print("BUILD: npm run build")
print("=" * 60)
out, err, code = run("cd /root/malibourse-app && npm run build 2>&1", timeout=300)

if code == 0:
    print("\nBuild SUCCESS!", flush=True)
else:
    print(f"\nBuild FAILED with code {code}", flush=True)

# PM2
print("\n" + "=" * 60)
print("PM2: Start application")
print("=" * 60)
run("cd /root/malibourse-app && pm2 restart malibourse 2>/dev/null || pm2 start npm --name malibourse -- start")
run("pm2 save")

# Nginx
print("\n" + "=" * 60)
print("NGINX: Configure")
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

# Verify
print("\n" + "=" * 60)
print("VERIFY: Check everything")
print("=" * 60)
run("pm2 list")
run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:3000/")
run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80/ -H 'Host: etudiantsmali.ru'")

# Import schema
print("\n" + "=" * 60)
print("DATABASE: Import schema")
print("=" * 60)
run("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/malibourse-app/sql/schema.sql 2>&1 | tail -5")

print("\n" + "=" * 60)
print("DEPLOYMENT COMPLETE!")
print("=" * 60)
print(f"IP: {HOST}")
print(f"App: http://{HOST}")
print(f"Domain: http://etudiantsmali.ru (after DNS update)")

ssh.close()
