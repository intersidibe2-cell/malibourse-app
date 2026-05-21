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
    return out, ec

# Test multiple static files
files = [
    "/_next/static/chunks/0eeqtkeiqodyw.css",
    "/_next/static/chunks/0ze4gu236oq96.js",
    "/_next/static/chunks/0osn5uk23_xlz.js",
    "/_next/static/chunks/07lhk_q6pmm3r.js",
    "/_next/static/chunks/turbopack-15q20wojy_77g.js",
    "/",
]

print("=== Testing all failing files via HTTPS ===", flush=True)
for f in files:
    out, ec = run(f"curl -s -o /dev/null -w '%{{http_code}}' --insecure https://etudiantsmali.ru{f} 2>&1")
    print(f"  {f}: {out}", flush=True)

print("\n=== Direct via localhost:3000 ===", flush=True)
for f in files:
    out, ec = run(f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost:3000{f} 2>&1")
    print(f"  {f}: {out}", flush=True)

# Clear Nginx error log and check after fresh requests
print("\n=== Fresh Nginx error log (last 5) ===", flush=True)
run("truncate -s 0 /var/log/nginx/error.log")
# Make fresh request
run("curl -s --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css > /dev/null")
out, _ = run("tail -5 /var/log/nginx/error.log")
print(out or "(no errors)", flush=True)

ssh.close()
