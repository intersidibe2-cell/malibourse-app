import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

# Enable gzip compression  
gzip_config = """
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 5;
gzip_min_length 256;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/xml
    image/svg+xml
    font/woff
    font/woff2;
"""

# Add to /etc/nginx/nginx.conf if not already there
i, o, e = ssh.exec_command("grep -c 'gzip on' /etc/nginx/nginx.conf", timeout=10)
if o.channel.recv_exit_status() != 0:
    run("sed -i '/^http {/a " + gzip_config.replace("\n", "\\n") + "' /etc/nginx/nginx.conf 2>/dev/null")
    
# Alternative - add to the include
run('echo "' + gzip_config + '" > /etc/nginx/conf.d/gzip.conf')
print("Gzip config created!", flush=True)

run("nginx -t && systemctl reload nginx")
print("Nginx reloaded with gzip!", flush=True)

ssh.close()
