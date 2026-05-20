import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=30):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    c = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if out: print(out[:500], flush=True)
    if c != 0 and err: print("ERR: " + err[:200], flush=True)

print("=== PM2 Error logs ===", flush=True)
run("cat /root/.pm2/logs/malibourse-error.log 2>/dev/null", 10)

print("\n=== PM2 cwd ===", flush=True)
run("pm2 show malibourse 2>&1 | grep -i 'cwd\\|exec\\|script\\|path'", 10)

print("\n=== Try starting app directly ===", flush=True)
run("cd /root/malibourse-app && npm run start 2>&1 &", 10)

print("\n=== Check port again ===", flush=True)
run("ss -tlnp | grep -E '3000|80|443' 2>/dev/null", 10)

ssh.close()
