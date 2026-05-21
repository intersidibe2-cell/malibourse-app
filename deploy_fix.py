import paramiko, sys, time
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=30):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if out:
        for line in out.split("\n")[-5:]:
            if line.strip():
                print("  " + line.strip(), flush=True)
    return out

print("=== Pulling latest code ===", flush=True)
run("cd /root/malibourse-app && git pull origin master 2>&1", 30)

print("\n=== Running SQL migration ===", flush=True)
run("cd /root/malibourse-app && PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f sql/migration_annonces.sql 2>&1", 15)

print("\n=== Building ===", flush=True)
run("cd /root/malibourse-app && npm run build 2>&1 | tail -20", 300)

print("\n=== Restarting PM2 ===", flush=True)
run("pm2 delete malibourse 2>/dev/null", 5)
run("cd /root/malibourse-app && pm2 start npm --name malibourse -- start 2>&1", 10)
time.sleep(3)

print("\n=== Testing ===", flush=True)
run("curl -s -o /dev/null -w 'Port 3000: %{http_code}' http://localhost:3000/ 2>&1", 10)
time.sleep(1)
run("curl -sL -o /dev/null -w 'HTTPS: %{http_code}' https://etudiantsmali.ru/ 2>&1", 10)

print("\n=== Server status ===", flush=True)
run("ss -tlnp | grep -E '3000|443'", 10)
run("pm2 list", 5)

ssh.close()
print("\nDone!", flush=True)
