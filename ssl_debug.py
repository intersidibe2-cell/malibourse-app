import paramiko
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)
print("Connected!", flush=True)

def run(cmd, timeout=120):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        print(out[:500], flush=True)
    if exit_code != 0 and err:
        print(f"ERR: {err[:300]}", flush=True)
    return out, exit_code

print("=== Certbot logs ===", flush=True)
run("tail -20 /var/log/letsencrypt/letsencrypt.log")

print("\n=== Nginx config ===", flush=True)
run("cat /etc/nginx/sites-available/etudiantsmali.ru")

# First stop nginx to run standalone certbot
print("\n=== Stopping Nginx for standalone certbot ===", flush=True)
run("systemctl stop nginx")

time.sleep(2)

print("\n=== Running certbot standalone ===", flush=True)
run('certbot certonly --standalone -d etudiantsmali.ru -d www.etudiantsmali.ru --non-interactive --agree-tos -m sidibe3131@mail.ru 2>&1', timeout=120)

print("\n=== Checking certificates ===", flush=True)
run("ls -la /etc/letsencrypt/live/etudiantsmali.ru/ 2>/dev/null || echo NO CERTS")

print("\n=== Restarting Nginx ===", flush=True)
run("systemctl start nginx")

time.sleep(2)

print("\n=== Test HTTPS ===", flush=True)
run("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1 || echo FAILED", timeout=15)

# If standalone worked, configure nginx to use the cert
print("\n=== Checking if cert exists ===", flush=True)
out, code = run("test -f /etc/letsencrypt/live/etudiantsmali.ru/fullchain.pem && echo YES || echo NO")
print(f"Cert exists: {out}", flush=True)

if "YES" in out:
    print("\n=== Configuring Nginx with SSL ===", flush=True)
    sftp = ssh.open_sftp()
    with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
        f.write("server {\n")
        f.write("    listen 80;\n")
        f.write("    server_name etudiantsmali.ru www.etudiantsmali.ru;\n")
        f.write("    return 301 https://$server_name$request_uri;\n")
        f.write("}\n")
        f.write("\n")
        f.write("server {\n")
        f.write("    listen 443 ssl;\n")
        f.write("    server_name etudiantsmali.ru www.etudiantsmali.ru;\n")
        f.write("\n")
        f.write("    ssl_certificate /etc/letsencrypt/live/etudiantsmali.ru/fullchain.pem;\n")
        f.write("    ssl_certificate_key /etc/letsencrypt/live/etudiantsmali.ru/privkey.pem;\n")
        f.write("\n")
        f.write("    location / {\n")
        f.write("        proxy_pass http://localhost:3000;\n")
        f.write("        proxy_http_version 1.1;\n")
        f.write("        proxy_set_header Upgrade $http_upgrade;\n")
        f.write("        proxy_set_header Connection 'upgrade';\n")
        f.write("        proxy_set_header Host $host;\n")
        f.write("        proxy_cache_bypass $http_upgrade;\n")
        f.write("    }\n")
        f.write("}\n")
    sftp.close()
    print("SSL Nginx config written!", flush=True)
    
    run("nginx -t && systemctl reload nginx")
    time.sleep(2)
    
    print("\n=== Final HTTPS test ===", flush=True)
    run("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1", timeout=15)

ssh.close()
print("\nDone!", flush=True)
