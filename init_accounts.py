import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

pw_hash = "VotreHashIci"

# Create SQL file
sql = "-- Add login column\n"
sql += "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login VARCHAR(50) UNIQUE;\n\n"
sql += "-- Insert or update accounts\n"

accounts = [
    ("ambassadeur", "ambassadeur@etudiantsmali.ru", "Ambassadeur", "Mali", "admin", "ambassadeur"),
    ("culturel", "culturel@etudiantsmali.ru", "Conseiller", "Culturel", "user", "culturel"),
    ("comptable", "comptable@etudiantsmali.ru", "Agent", "Comptable", "user", "comptable"),
    ("consulaire", "consulaire@etudiantsmali.ru", "Conseiller", "Consulaire", "user", "consulaire"),
    ("defense", "defense@etudiantsmali.ru", "Attache", "Defense", "user", "defense"),
    ("secretariat", "secretariat@etudiantsmali.ru", "Agent", "Secretariat", "user", "secretariat"),
]

for login, email, nom, prenom, role, spec in accounts:
    sql += f"INSERT INTO profiles (login, email, nom, prenom, password_hash, role, role_specifique)\n"
    sql += f"VALUES ('{login}', '{email}', '{nom}', '{prenom}', '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOFiNOkIhPTFA/rqvYoHbFikYHRHYJVyC', '{role}', '{spec}')\n"
    sql += f"ON CONFLICT (login) DO UPDATE SET role_specifique = '{spec}', password_hash = '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOFiNOkIhPTFA/rqvYoHbFikYHRHYJVyC';\n"

# Update admin email
sql += "\nUPDATE profiles SET login = 'admin' WHERE email = 'intersidibe2@gmail.com';\n"

# Upload via SFTP
sftp = ssh.open_sftp()
with sftp.open("/root/init_accounts.sql", "w") as f:
    f.write(sql)
sftp.close()
print("SQL file uploaded!", flush=True)

# Execute
i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/init_accounts.sql 2>&1", timeout=30)
o.channel.recv_exit_status()
out = o.read().decode("utf-8", errors="replace").strip()
print(out, flush=True)

# Verify
i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -c \"SELECT login, role, role_specifique FROM profiles WHERE login IS NOT NULL ORDER BY role_specifique;\"", timeout=15)
o.channel.recv_exit_status()
result = o.read().decode("utf-8", errors="replace").strip()
print("\n=== Comptes créés ===", flush=True)
print(result, flush=True)

ssh.close()
print("\n✅ Terminé !", flush=True)
