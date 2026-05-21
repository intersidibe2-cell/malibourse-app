import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=10)

def run(cmd, t=10):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if out:
        for line in out.split("\n")[-10:]:
            if line.strip():
                print("  " + line.strip())
    if err:
        for line in err.split("\n")[-5:]:
            if line.strip():
                print("  ERR: " + line.strip())
    return out

print("=== Checking Brotli ===")
out = run("nginx -V 2>&1")
has_brotli = "brotli" in out.lower()
print("  Brotli available:", has_brotli)

print("\n=== Reading current config ===")
run("cat /etc/nginx/sites-enabled/etudiantsmali.ru")

if has_brotli:
    print("\n=== Adding Brotli + Cache to config ===")
    # Add brotli to http block
    run("""grep -q 'brotli on' /etc/nginx/nginx.conf || sed -i '/^http {/a\\    brotli on;\\n    brotli_comp_level 6;\\n    brotli_types text/plain text/css application/json application/javascript image/svg+xml font/woff2;' /etc/nginx/nginx.conf""", 5)

# Add cache locations to server block - insert before the last }
config = run("cat /etc/nginx/sites-enabled/etudiantsmali.ru")
if "location /_next/static/" not in config:
    # Use sed to add cache locations before the final } in the server block
    cache_block = """
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
    }"""

    # Escape for sed
    cache_escaped = cache_block.replace("\n", "\\n").replace("/", "\\/")
    cmd = f'cat /etc/nginx/sites-enabled/etudiantsmali.ru | head -n -1 > /tmp/nginx_new.conf && echo "{cache_block}" >> /tmp/nginx_new.conf && echo "}}" >> /tmp/nginx_new.conf && cp /tmp/nginx_new.conf /etc/nginx/sites-enabled/etudiantsmali.ru'
    run(cmd, 5)
    print("  Cache locations added")

print("\n=== Testing nginx config ===")
run("nginx -t", 5)

print("\n=== Reloading nginx ===")
run("systemctl reload nginx", 5)

print("\n=== Final config ===")
run("cat /etc/nginx/sites-enabled/etudiantsmali.ru")

ssh.close()
print("\nDone!")
