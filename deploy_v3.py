import paramiko, sys, time
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=60):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    c = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if out:
        print(out[:300], flush=True)
    if c != 0 and err:
        print("ERR: " + err[:200], flush=True)
    return out, c

# Clean git
print("=== Cleaning git ===", flush=True)
run("cd /root/malibourse-app && git reset --hard HEAD && git clean -fd", 10)
run("cd /root/malibourse-app && git pull origin master 2>&1", 30)
print("Git clean and pull done", flush=True)

# Rebuild
print("=== Rebuilding ===", flush=True)
run("cd /root/malibourse-app && npm install 2>&1", 60)
run("cd /root/malibourse-app && npm run build 2>&1", 300)

# SSL
print("=== SSL Certificate ===", flush=True)
run("certbot --nginx -d etudiantsmali.ru -d www.etudiantsmali.ru --non-interactive --agree-tos -m sidibe3131@mail.ru 2>&1", 120)

# Restart
print("=== Restart ===", flush=True)
run("nginx -t && systemctl reload nginx", 10)
run("pm2 restart malibourse", 10)

time.sleep(3)

# Test
print("=== Testing ===", flush=True)
run('curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3000/ 2>&1', 10)
run('curl -s -o /dev/null -w "HTTPS %{http_code}" https://etudiantsmali.ru/ 2>&1', 10)

ssh.close()
print("Done!", flush=True)
