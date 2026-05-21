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

# Remove the /_next/static location that conflicts with Next.js
old = """\n    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location /_next/static {
        alias /root/malibourse-app/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }"""

new = """\n    # Cache static assets (immutable hashed files)
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }"""

config = config.replace(old, new)

with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write(config)
sftp.close()
print("Nginx config fixed (removed /_next/static alias)", flush=True)

run("nginx -t && systemctl reload nginx")
print("Nginx reloaded!", flush=True)

ssh.close()
