import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

print("=== .next/static contents ===", flush=True)
print(run("ls -la /root/malibourse-app/.next/static/chunks/ 2>&1 | head -30"), flush=True)

print("\n=== Build manifest ===", flush=True)
print(run("head -20 /root/malibourse-app/.next/build-manifest.json 2>&1"), flush=True)

print("\n=== Check specific chunks ===", flush=True)
print(run("find /root/malibourse-app/.next -name '*0eeqt*' 2>&1"), flush=True)

print("\n=== PM2 logs (last 10 lines) ===", flush=True)
print(run("pm2 logs malibourse --lines 10 --nostream 2>&1"), flush=True)

print("\n=== Nginx config ===", flush=True)
print(run("cat /etc/nginx/sites-available/etudiantsmali.ru"), flush=True)

ssh.close()
