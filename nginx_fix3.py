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

# Remove ALL cache location blocks - let proxy_pass handle everything
while "location ~* \\" in config:
    idx = config.find("location ~* \\")
    end = config.find("}", idx) + 1
    # Remove from start of line before "location" through the closing brace
    start = config.rfind("\n", 0, idx) + 1
    # Find the blank line after the block
    rest = config[end:]
    rest_start = 0
    while rest_start < len(rest) and rest[rest_start] in ' \n':
        rest_start += 1
    config = config[:start] + rest[rest_start:]

with sftp.open("/etc/nginx/sites-available/etudiantsmali.ru", "w") as f:
    f.write(config)
sftp.close()
print("All cache location blocks removed", flush=True)

run("nginx -t && systemctl reload nginx")
print("Nginx reloaded!", flush=True)

# Test
print("\n=== Testing ===", flush=True)
print("Direct: " + run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/_next/static/chunks/0eeqtkeiqodyw.css 2>&1"), flush=True)
print("HTTPS:  " + run("curl -s -o /dev/null -w '%{http_code}' --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1"), flush=True)
print("HTTPS2: " + run("curl -s -o /dev/null -w '%{http_code}' --insecure https://etudiantsmali.ru/ 2>&1"), flush=True)

ssh.close()
