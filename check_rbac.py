import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -c \"SELECT login, role, role_specifique FROM profiles WHERE login IS NOT NULL ORDER BY login;\"", timeout=10)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)

ssh.close()
