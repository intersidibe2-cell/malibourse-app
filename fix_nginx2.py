import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=10)

# Read current broken config
i, o, e = ssh.exec_command("cat /etc/nginx/sites-enabled/etudiantsmali.ru", timeout=5)
broken = o.read().decode()
print("BROKEN CONFIG:")
print(broken)

# Write correct config
correct = '''server {
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

    gzip on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml font/woff2;

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /uploads/ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

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
'''

# Upload the fixed config
with ssh.open_sftp() as sftp:
    with sftp.open("/etc/nginx/sites-enabled/etudiantsmali.ru", "w") as f:
        f.write(correct)

print("\nConfig written. Testing...")
i, o, e = ssh.exec_command("nginx -t", timeout=5)
o.channel.recv_exit_status()
out = o.read().decode().strip()
err = e.read().decode().strip()
if out: print(out)
if err: print(err)

if "test failed" not in out.lower() and "test failed" not in err.lower():
    print("Config OK. Reloading nginx...")
    i, o, e = ssh.exec_command("systemctl reload nginx", timeout=5)
    o.channel.recv_exit_status()
    print("Done!")
else:
    print("CONFIG TEST FAILED!")

ssh.close()
