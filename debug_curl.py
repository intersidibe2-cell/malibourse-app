import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

print("=== Full verbose curl for HTTPS CSS ===", flush=True)
i, o, e = ssh.exec_command("curl -v --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1 | head -40", timeout=15)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)

print("\n=== Check actual Nginx config now ===", flush=True)
print(run("cat /etc/nginx/sites-available/etudiantsmali.ru"), flush=True)

ssh.close()
