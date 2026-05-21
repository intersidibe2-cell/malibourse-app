import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

# Write gzip config via SFTP
sftp = ssh.open_sftp()
with sftp.open("/etc/nginx/conf.d/gzip.conf", "w") as f:
    f.write("gzip on;\n")
    f.write("gzip_vary on;\n")
    f.write("gzip_proxied any;\n")
    f.write("gzip_comp_level 5;\n")
    f.write("gzip_min_length 256;\n")
    f.write("gzip_types text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff font/woff2;\n")
sftp.close()
print("gzip.conf written", flush=True)

i, o, e = ssh.exec_command("nginx -t && systemctl reload nginx", timeout=15)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)

ssh.close()
print("Gzip + Nginx OK!", flush=True)
