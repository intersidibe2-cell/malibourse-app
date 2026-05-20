import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

pw_hash = "$2b$12$DSwtS9ailKRUYXKYOgaJWO0p1IRMPWTZKztzFc5FYn0FDUu9VZ.5y"

# Create SQL update script
sql = ""
accounts = ["ambassadeur", "culturel", "comptable", "consulaire", "defense", "secretariat"]
for login in accounts:
    sql += f"UPDATE profiles SET password_hash = '{pw_hash}' WHERE login = '{login}';\n"
sql += "UPDATE profiles SET password_hash = '" + pw_hash + "' WHERE email = 'intersidibe2@gmail.com';\n"

sftp = ssh.open_sftp()
with sftp.open("/root/fix_passwords.sql", "w") as f:
    f.write(sql)

i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/fix_passwords.sql 2>&1", timeout=15)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)

# Verify
i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -c \"SELECT login FROM profiles WHERE login IS NOT NULL ORDER BY login;\"", timeout=10)
o.channel.recv_exit_status()
print("\nComptes mis à jour:", o.read().decode("utf-8", errors="replace").strip(), flush=True)

ssh.close()
print("\n✅ Tous les mots de passe sont maintenant: ambassade2026", flush=True)
