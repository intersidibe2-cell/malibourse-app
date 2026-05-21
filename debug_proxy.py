import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    ec = o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip(), ec

# Test 1: verbose curl to see full response
print("=== Verbose HTTPS CSS request ===", flush=True)
out, _ = run("curl -s -D - --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1 | head -20")
print(out, flush=True)

# Test 2: Check if Next.js access log shows the request
print("\n=== Check if request reaches Next.js ===", flush=True)
out, _ = run("journalctl -u pm2-root --since '5 min ago' --no-pager 2>&1 | grep -i '0eeqtkeiqodyw' | head -5")
print(out or "(no matches)", flush=True)

# Test 3: Check Next.js stdout log for the path
print("\n=== PM2 logs for path ===", flush=True)
out, _ = run("tail -100 /root/.pm2/logs/malibourse-out.log 2>&1 | grep -i '0eeqt' | head -5")
print(out or "(no matches)", flush=True)

# Test 4: Direct curl of the file on port 3000
print("\n=== Direct to Next.js port 3000 ===", flush=True)
out, _ = run("curl -s -D - http://localhost:3000/_next/static/chunks/0eeqtkeiqodyw.css 2>&1 | head -20")
print(out, flush=True)

# Test 5: Check if localhost resolves  
print("\n=== Test localhost ===", flush=True)
out, _ = run("ping -c1 localhost 2>&1")
print(out, flush=True)
out, _ = run("getent hosts localhost 2>&1")
print(out, flush=True)

ssh.close()
