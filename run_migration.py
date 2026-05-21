import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

with ssh.open_sftp() as sftp:
    sftp.put("sql/migration_signalements.sql", "/root/migration_signalements.sql")

db_url = "postgresql://malibourse_admin:Rg6kHq9zVp2x@localhost:5432/malibourse"
out = run(f"PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/migration_signalements.sql 2>&1")
print(out, flush=True)

ssh.close()
