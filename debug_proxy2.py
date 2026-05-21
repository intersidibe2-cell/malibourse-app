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

# Full effective nginx config (only the http block portions)
print("=== nginx -T (full effective config - http servers) ===", flush=True)
out, _ = run("nginx -T 2>&1 | grep -A 30 'server_name etudiantsmali.ru' | head -60")
print(out, flush=True)

# Check if default server is catching requests
print("\n=== Default server block ===", flush=True)
out, _ = run("nginx -T 2>&1 | grep -B2 -A20 'listen 443 ssl' | head -60")
print(out, flush=True)

ssh.close()
