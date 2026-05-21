import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

sftp = ssh.open_sftp()
with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "r") as f:
    config = f.read().decode("utf-8")

# Fix: add proxy_pass inside all cache location blocks
old = """    # Cache static assets (immutable hashed files)
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    return 301 https://$host$request_uri;"""

new = """    # Cache static assets (immutable hashed files)
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    return 301 https://$host$request_uri;"""

config = config.replace(old, new)

old2 = """    # Cache static assets (immutable hashed files)
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }


    ssl_certificate"""

new2 = """    # Cache static assets (immutable hashed files)
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ssl_certificate"""

config = config.replace(old2, new2)

with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write(config)
sftp.close()
print("Nginx config fixed (proxy_pass inside cache locations)", flush=True)

run("nginx -t && systemctl reload nginx")
print("Nginx reloaded!", flush=True)

ssh.close()
