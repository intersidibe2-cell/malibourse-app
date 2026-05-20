import paramiko, sys, time
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=60):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    c = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if out: print(out[:400], flush=True)
    if c != 0 and err: print("ERR: " + err[:200], flush=True)
    return out, c

print("=== Current Nginx config ===", flush=True)
run("cat /etc/nginx/sites-available/etudiantsmali.ru", 10)

print("\n=== Certificates ===", flush=True)
run("certbot certificates 2>&1 | head -10", 10)

# Fix Nginx with SSL config via SFTP
print("\n=== Writing corrected Nginx config ===", flush=True)
sftp = ssh.open_sftp()
with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write("server {\n")
    f.write("    listen 80;\n")
    f.write("    server_name etudiantsmali.ru www.etudiantsmali.ru;\n")
    f.write("    return 301 https://$host$request_uri;\n")
    f.write("}\n")
    f.write("\n")
    f.write("server {\n")
    f.write("    listen 443 ssl;\n")
    f.write("    server_name etudiantsmali.ru www.etudiantsmali.ru;\n")
    f.write("\n")
    f.write("    ssl_certificate /etc/letsencrypt/live/etudiantsmali.ru/fullchain.pem;\n")
    f.write("    ssl_certificate_key /etc/letsencrypt/live/etudiantsmali.ru/privkey.pem;\n")
    f.write("    include /etc/letsencrypt/options-ssl-nginx.conf;\n")
    f.write("    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;\n")
    f.write("\n")
    f.write("    location / {\n")
    f.write("        proxy_pass http://localhost:3000;\n")
    f.write("        proxy_http_version 1.1;\n")
    f.write("        proxy_set_header Upgrade $http_upgrade;\n")
    f.write("        proxy_set_header Connection 'upgrade';\n")
    f.write("        proxy_set_header Host $host;\n")
    f.write("        proxy_cache_bypass $http_upgrade;\n")
    f.write("        proxy_set_header X-Real-IP $remote_addr;\n")
    f.write("        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n")
    f.write("        proxy_set_header X-Forwarded-Proto $scheme;\n")
    f.write("    }\n")
    f.write("}\n")
sftp.close()
print("Config written", flush=True)

run("nginx -t && systemctl reload nginx", 10)
time.sleep(2)

print("\n=== Testing ===", flush=True)
run("curl -sL -o /dev/null -w 'HTTP: %{http_code}' http://etudiantsmali.ru/ 2>&1", 10)
time.sleep(1)
run("curl -sL -o /dev/null -w 'HTTPS: %{http_code}' https://etudiantsmali.ru/ 2>&1", 10)

ssh.close()
print("\nAll done!", flush=True)
