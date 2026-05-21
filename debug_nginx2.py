import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    ec = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    return out + ("\nSTDERR: " + err if err else ""), ec

# Check for ANY default_server or server blocks
print("=== All server blocks from nginx -T ===", flush=True)
out, _ = run("nginx -T 2>&1 | grep -E '^\s*server\s*{|^\s*listen\s|^\s*server_name\s' | head -40")
print(out, flush=True)

print("\n=== Check for default_server ===", flush=True)
out, _ = run("nginx -T 2>&1 | grep 'default_server'")
print(out or "(no default_server found)", flush=True)

# Check if .next directory listing is accessible via Next.js
print("\n=== Check build manifest path ===", flush=True)
out, _ = run("cat /root/malibourse-app/.next/build-manifest.json 2>&1 | python3 -c \"import sys,json; d=json.load(sys.stdin); print(json.dumps(d.get('rootMainFiles', []), indent=2))\" 2>&1")
print(out, flush=True)

# Check if the actual file exists in .next
print("\n=== Verify file exists ===", flush=True)
out, _ = run("ls -la /root/malibourse-app/.next/static/chunks/0eeqtkeiqodyw.css 2>&1")
print(out, flush=True)

# Full verbose curl
print("\n=== Verbose curl HTTPS ===", flush=True)
out, _ = run("curl -v --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1 | tail -30")
print(out, flush=True)

ssh.close()
