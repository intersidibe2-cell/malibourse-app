import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

# Check file content
path = "/root/malibourse-app/src/app/(admin)/dashboard/page.tsx"
i, o, e = ssh.exec_command("head -20 '" + path + "'", timeout=10)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()
print("File content:", flush=True)
print(out[:1000], flush=True)

# Clean build
print("\nCleaning build cache...", flush=True)
i, o, e = ssh.exec_command("rm -rf /root/malibourse-app/.next && cd /root/malibourse-app && npm run build 2>&1 | tail -20", timeout=300)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()
print("Build result:", out[:2000], flush=True)

ssh.close()
