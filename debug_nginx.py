import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

print("=== All Nginx site configs ===", flush=True)
print(run("ls -la /etc/nginx/sites-enabled/"), flush=True)

print("\n=== Default Nginx config ===", flush=True)
print(run("cat /etc/nginx/sites-enabled/default 2>&1"), flush=True)

print("\n=== Full nginx.conf ===", flush=True)
print(run("cat /etc/nginx/nginx.conf"), flush=True)

print("\n=== Conf.d files ===", flush=True)
print(run("ls /etc/nginx/conf.d/"), flush=True)
print(run("cat /etc/nginx/conf.d/gzip.conf 2>&1"), flush=True)

print("\n=== Full effective config ===", flush=True)
print(run("nginx -T 2>&1 | head -80"), flush=True)

ssh.close()
