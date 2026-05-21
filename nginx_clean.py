import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run_check(cmd, t=15):
    """Run command and return (stdout, exit_code)"""
    i, o, e = ssh.exec_command(cmd, timeout=t)
    ec = o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip(), ec

# 1. Remove gzip.conf (the gzip in nginx.conf is already on)
sftp = ssh.open_sftp()
try:
    sftp.unlink("/etc/nginx/conf.d/gzip.conf")
    print("Removed gzip.conf", flush=True)
except:
    print("gzip.conf not found, continuing", flush=True)

# 2. Write a clean site config
config = """server {
    listen 80;
    server_name etudiantsmali.ru www.etudiantsmali.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name etudiantsmali.ru www.etudiantsmali.ru;

    ssl_certificate /etc/letsencrypt/live/etudiantsmali.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/etudiantsmali.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

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
}
"""

with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write(config)
sftp.close()
print("Clean config written", flush=True)

# 3. Test and reload
print("\n=== nginx -t ===", flush=True)
out, ec = run_check("nginx -t 2>&1")
print(f"Exit: {ec}, Output: {out}", flush=True)

if ec == 0:
    print("\n=== nginx reload ===", flush=True)
    out, ec = run_check("systemctl reload nginx 2>&1")
    print(f"Exit: {ec}, Output: {out}", flush=True)
    
    print("\n=== Testing ===", flush=True)
    out, ec = run_check("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1")
    print(f"CSS file via HTTPS: {out}", flush=True)
    out, ec = run_check("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1")
    print(f"Homepage: {out}", flush=True)
else:
    print("Nginx test FAILED - fixing...", flush=True)

ssh.close()
