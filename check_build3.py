import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

# Get the actual build error output
cmd = "cd /root/malibourse-app && npm run build 2>&1"
i, o, e = ssh.exec_command(cmd, timeout=300)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()

# Find lines with "error" or "not found" or "did you mean"
lines = out.split("\n")
for line in lines[-30:]:
    print(line, flush=True)

ssh.close()
