import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

print("=== Nginx config ===", flush=True)
print(run("cat /etc/nginx/sites-available/etudiantsmali.ru"), flush=True)

print("\n=== Direct curl test of static file ===", flush=True)
print(run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/_next/static/chunks/0eeqtkeiqodyw.css 2>&1"), flush=True)

print("\n=== Curl via HTTPS ===", flush=True)
print(run("curl -s -o /dev/null -w '%{http_code}' --insecure https://etudiantsmali.rU/_next/static/chunks/0eeqtkeiqodyw.css 2>&1"), flush=True)

ssh.close()
