import paramiko, sys, time
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=300):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    c = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    lines = (out + "\n" + err).strip()
    for line in lines.split("\n")[-5:]:
        if line.strip():
            print("  " + line.strip(), flush=True)
    if c != 0 and "npm run build" not in cmd.lower() and "error" in err.lower():
        pass  # build errors are expected to show
    return out, c

print("=== Rebuilding app ===", flush=True)
out, code = run("cd /root/malibourse-app && npm run build 2>&1", 300)

if code == 0:
    print("Build SUCCESS!", flush=True)
else:
    print(f"Build FAILED (code {code})", flush=True)
    print("Trying to rebuild...", flush=True)
    run("cd /root/malibourse-app && npx next build 2>&1", 300)

time.sleep(2)

print("\n=== Starting PM2 ===", flush=True)
run("pm2 delete malibourse 2>/dev/null; cd /root/malibourse-app && pm2 start npm --name malibourse -- start 2>&1", 15)
time.sleep(3)

print("\n=== Testing ===", flush=True)
run("curl -s -o /dev/null -w 'HTTP port 3000: %{http_code}' http://localhost:3000/ 2>&1", 10)
time.sleep(1)
run("curl -sL -o /dev/null -w 'HTTP port 80: %{http_code}' http://etudiantsmali.ru/ 2>&1", 10)
time.sleep(1)
run("curl -sL -o /dev/null -w 'HTTPS: %{http_code}' https://etudiantsmali.ru/ 2>&1", 10)

print("\n=== Listening ports ===", flush=True)
run("ss -tlnp | grep -E '3000|80|443'", 10)

ssh.close()
print("\nDone!", flush=True)
