import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

pw = "$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOFiNOkIhPTFA/rqvYoHbFikYHRHYJVyC"

sql = "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login VARCHAR(50) UNIQUE;\n"

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
    sql += f"VALUES ('{login}', '{email}', '{nom}', '{prenom}', '{pw}', '{role}', '{spec}')\n"
    sql += f"ON CONFLICT (email) DO UPDATE SET login = '{login}', role_specifique = '{spec}', password_hash = '{pw}';\n"

# Also set login for admin
sql += "UPDATE profiles SET login = 'admin' WHERE email = 'intersidibe2@gmail.com';\n"

sftp = ssh.open_sftp()
with sftp.open("/root/fix_accounts.sql", "w") as f:
    f.write(sql)
sftp.close()
print("SQL uploaded!", flush=True)

i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/fix_accounts.sql 2>&1", timeout=30)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)

# Verify
i, o, e = ssh.exec_command("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -c \"SELECT login, role, role_specifique FROM profiles WHERE login IS NOT NULL ORDER BY role_specifique;\"", timeout=15)
o.channel.recv_exit_status()
result = o.read().decode("utf-8", errors="replace").strip()
print("\n=== Comptes ===", flush=True)
print(result, flush=True)

print("\n✅ Connexions disponibles :", flush=True)
for login, email, nom, prenom, role, spec in accounts:
    print(f"  login: {login:15s} | mdp: ambassade2026 | rôle: {spec}", flush=True)

ssh.close()
