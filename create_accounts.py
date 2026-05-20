import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=30):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    c = o.channel.recv_exit_status()
    out = o.read().decode("utf-8", errors="replace").strip()
    err = e.read().decode("utf-8", errors="replace").strip()
    if c != 0 and err: print("ERR: " + err[:200], flush=True)
    return out

# Password hash for "Ambassade2026!"
# Using bcrypt hash
hash_cmd = "python3 -c \"import bcrypt; print(bcrypt.hashpw(b'Ambassade2026!', bcrypt.gensalt(12)).decode())\""
i, o, e = ssh.exec_command(hash_cmd, timeout=30)
pw_hash = o.read().decode("utf-8", errors="replace").strip()
print("Hash generated", flush=True)

agents = [
    ("ambassadeur@etudiantsmali.ru", "Ambassadeur", "Mali", "ambassadeur", "ambassadeur"),
    ("culturel@etudiantsmali.ru", "Conseiller", "Culturel", "user", "culturel"),
    ("comptable@etudiantsmali.ru", "Agent", "Comptable", "user", "comptable"),
    ("consulaire@etudiantsmali.ru", "Conseiller", "Consulaire", "user", "consulaire"),
    ("defense@etudiantsmali.ru", "Attaché", "Défense", "user", "defense"),
    ("secretariat@etudiantsmali.ru", "Agent", "Secrétariat", "user", "secretariat"),
]

created = 0
for email, prenom, nom, role, spec in agents:
    run(f"psql -U malibourse_admin -h localhost -d malibourse -c \"INSERT INTO profiles (email, nom, prenom, password_hash, role, role_specifique) VALUES ('{email}', '{nom}', '{prenom}', '{pw_hash}', '{role}', '{spec}') ON CONFLICT (email) DO UPDATE SET role_specifique = '{spec}', nom = '{nom}', prenom = '{prenom}';\"", 10)
    created += 1
    print(f"  ✅ {email} ({spec})", flush=True)

print(f"\n{created} comptes créés !", flush=True)
print("\n=== Identifiants ===", flush=True)
for email, prenom, nom, role, spec in agents:
    print(f"  {prenom} {nom:15s} | {email:35s} | {spec:15s} | Mot de passe: Ambassade2026!", flush=True)

ssh.close()
