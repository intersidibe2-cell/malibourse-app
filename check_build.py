import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

i, o, e = ssh.exec_command("cd /root/malibourse-app && npm run build 2>&1 | grep -i error | head -20", timeout=180)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()
print("Errors:", out[:2000] if out else "None", flush=True)

# Also check the actual file lines 10-14
i2, o2, e2 = ssh.exec_command("head -14 /root/malibourse-app/src/app/dashboard/page.tsx", timeout=10)
o2.channel.recv_exit_status()
file_content = o2.read().decode("utf-8", errors="replace").strip()
print("\nFile lines 1-14:", flush=True)
print(file_content[:500], flush=True)

ssh.close()
