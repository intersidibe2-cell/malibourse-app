import paramiko, sys, time
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)
print("Connected!", flush=True)

def run(cmd, timeout=300):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        lines = out.split("\n")
        for line in lines[-5:]:
            print("  " + line, flush=True)
    if exit_code != 0 and err:
        print("  ERR: " + err[-200:], flush=True)
    return out, exit_code

print("=== Pulling latest code ===", flush=True)
run("cd /root/malibourse-app && git pull origin master 2>&1", 30)
print("OK", flush=True)

print("=== Installing dependencies ===", flush=True)
run("cd /root/malibourse-app && npm install 2>&1", 60)

print("=== Building ===", flush=True)
run("cd /root/malibourse-app && npm run build 2>&1", 300)

print("=== Restarting app ===", flush=True)
run("pm2 restart malibourse 2>&1", 10)
time.sleep(3)

print("=== Testing ===", flush=True)
test_cmd = "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:3000/ 2>&1"
out, code = run(test_cmd, 10)
print(f"HTTP: {out}", flush=True)

ssh.close()
print("=== Deploy complete! ===", flush=True)
