import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

# Pre-hashed password for "Ambassade2026!"
pw_hash = "$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOFiNOkIhPTFA/rqvYoHbFikYHRHYJVyC"

agents = [
    ("ambassadeur@etudiantsmali.ru", "Ambassadeur", "Mali", "admin", "ambassadeur"),
    ("culturel@etudiantsmali.ru", "Conseiller", "Culturel", "user", "culturel"),
    ("comptable@etudiantsmali.ru", "Agent", "Comptable", "user", "comptable"),
    ("consulaire@etudiantsmali.ru", "Conseiller", "Consulaire", "user", "consulaire"),
    ("defense@etudiantsmali.ru", "Atache", "Defense", "user", "defense"),
    ("secretariat@etudiantsmali.ru", "Agent", "Secretariat", "user", "secretariat"),
]

sftp = ssh.open_sftp()
sql_content = ""
for email, nom, prenom, role, spec in agents:
    sql_content += f"INSERT INTO profiles (email, nom, prenom, password_hash, role, role_specifique) VALUES ('{email}', '{nom}', '{prenom}', '{pw_hash}', '{role}', '{spec}') ON CONFLICT (email) DO UPDATE SET role_specifique = '{spec}', password_hash = '{pw_hash}';\n"

with sftp.open("/root/insert_agents.sql", "w") as f:
    f.write(sql_content)

i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/insert_agents.sql 2>&1", timeout=30)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()
print(out, flush=True)

# Verify
i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -c \"SELECT email, role, role_specifique FROM profiles WHERE email LIKE '%etudiantsmali.ru';\"", timeout=15)
o.channel.recv_exit_status()
result = o.read().decode("utf-8", errors="replace").strip()
print("\n=== Comptes créés ===", flush=True)
print(result, flush=True)

ssh.close()
print("\n✅ Comptes créés avec succès !", flush=True)
