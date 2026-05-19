import paramiko
import os
import time

HOST = "109.120.152.235"
PORT = 22
USER = "root"
PASSWORD = "7gGR3K8pKBH7"
PROJECT_PATH = r"D:\projets IT\Gestion des etudiants au mali\malibourse-russie"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd, ok_fail=False):
    print(f"\n> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(out)
    if err: print(f"  ! {err}")
    if exit_code != 0 and not ok_fail:
        print(f"  [ERREUR] code {exit_code}")
    return out, err, exit_code

print(f"Connecting to {HOST}...")
ssh.connect(HOST, PORT, USER, PASSWORD, look_for_keys=False, allow_agent=False)
print("Connected!\n")

# Step 1: System update
print("=" * 50)
print("STEP 1: System update + install dependencies")
print("=" * 50)
run("apt update -y")
run("apt upgrade -y")

# Step 2: Install Node.js 20
print("\n" + "=" * 50)
print("STEP 2: Install Node.js 20")
print("=" * 50)
run("curl -fsSL https://deb.nodesource.com/setup_20.x | bash -")
run("apt install -y nodejs")

# Check versions
run("node -v")
run("npm -v")

# Step 3: Install PostgreSQL
print("\n" + "=" * 50)
print("STEP 3: Install PostgreSQL")
print("=" * 50)
run("apt install -y postgresql postgresql-client")
run("systemctl start postgresql")
run("systemctl enable postgresql")

# Step 4: Create database and user
print("\n" + "=" * 50)
print("STEP 4: Create PostgreSQL database")
print("=" * 50)
run('su - postgres -c \"psql -c \\\"CREATE USER malibourse_admin WITH PASSWORD \\\'Rg6kHq9zVp2x\\\';\\\"\"', ok_fail=True)
run('su - postgres -c \"psql -c \\\"CREATE DATABASE malibourse OWNER malibourse_admin;\\\"\"', ok_fail=True)
run('su - postgres -c \"psql -c \\\"GRANT ALL PRIVILEGES ON DATABASE malibourse TO malibourse_admin;\\\"\"', ok_fail=True)

# Step 5: Install Nginx
print("\n" + "=" * 50)
print("STEP 5: Install Nginx + PM2")
print("=" * 50)
run("apt install -y nginx certbot python3-certbot-nginx")
run("npm install -g pm2")
run("systemctl start nginx")
run("systemctl enable nginx")

# Step 6: Upload project files
print("\n" + "=" * 50)
print("STEP 6: Upload project files")
print("=" * 50)
sftp = ssh.open_sftp()

# Create remote directory
sftp.mkdir("/root/malibourse-russie")
sftp.chdir("/root/malibourse-russie")

# Upload all project files excluding node_modules, .next, .git
upload_dirs = ["sql", "src"]
upload_files = ["package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs", ".env.local"]

for f in upload_files:
    local = os.path.join(PROJECT_PATH, f)
    if os.path.exists(local):
        sftp.put(local, f"/root/malibourse-russie/{f}")
        print(f"  Uploaded: {f}")

for d in upload_dirs:
    local_dir = os.path.join(PROJECT_PATH, d)
    remote_dir = f"/root/malibourse-russie/{d}"
    try:
        sftp.mkdir(remote_dir)
    except:
        pass
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            local_file = os.path.join(root, file)
            rel_path = os.path.relpath(local_file, PROJECT_PATH)
            remote_file = f"/root/malibourse-russie/{rel_path.replace(os.sep, '/')}"
            remote_subdir = os.path.dirname(remote_file)
            try:
                sftp.mkdir(remote_subdir)
            except:
                pass
            sftp.put(local_file, remote_file)
            print(f"  Uploaded: {rel_path}")

sftp.close()
print("\nUpload complete!")

# Step 7: Configure env
print("\n" + "=" * 50)
print("STEP 7: Configure environment")
print("=" * 50)
env_content = """DATABASE_URL=postgresql://malibourse_admin:Rg6kHq9zVp2x@localhost:5432/malibourse
JWT_SECRET=8f3a2b1c9d4e5f6a7b8c9d0e1f2a3b4c
NEXT_PUBLIC_APP_URL=https://etudiantsmali.ru
"""
run(f"cat > /root/malibourse-russie/.env.production << 'ENVEOF'\n{env_content}ENVEOF")

# Step 8: Run schema SQL
print("\n" + "=" * 50)
print("STEP 8: Import database schema")
print("=" * 50)
run("PGPASSWORD=Rg6kHq9zVp2x psql -U malibourse_admin -h localhost -d malibourse -f /root/malibourse-russie/sql/schema.sql")

# Step 9: Install npm deps
print("\n" + "=" * 50)
print("STEP 9: Install npm dependencies")
print("=" * 50)
run("cd /root/malibourse-russie && npm install")

# Step 10: Build
print("\n" + "=" * 50)
print("STEP 10: Build Next.js")
print("=" * 50)
run("cd /root/malibourse-russie && npm run build")

# Step 11: Start with PM2
print("\n" + "=" * 50)
print("STEP 11: Start with PM2")
print("=" * 50)
run("cd /root/malibourse-russie && pm2 start npm --name 'malibourse' -- start")
run("pm2 save")
run("pm2 startup systemd -u root --hp /root")

# Step 12: Nginx config
print("\n" + "=" * 50)
print("STEP 12: Configure Nginx")
print("=" * 50)
nginx_conf = """server {
    listen 80;
    server_name etudiantsmali.ru www.etudiantsmali.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}"""
run(f"cat > /etc/nginx/sites-available/etudiantsmali.ru << 'EOF'\n{nginx_conf}\nEOF")
run("ln -sf /etc/nginx/sites-available/etudiantsmali.ru /etc/nginx/sites-enabled/")
run("nginx -t")
run("systemctl reload nginx")

print("\n" + "=" * 50)
print("DEPLOYMENT COMPLETE!")
print("=" * 50)
print("\nSite should be accessible at: http://109.120.152.235")
print("Domain (after DNS config): https://etudiantsmali.ru\n")

ssh.close()
