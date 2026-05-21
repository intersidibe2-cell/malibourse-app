import paramiko, sys
sys.stdout = open(1, "w", encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)

def run(cmd, t=15):
    i, o, e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    return o.read().decode("utf-8", errors="replace").strip()

# Test with the actual HTTP response status, and also check if the path exists in expected location
print("=== Direct localhost (port 3000) test ===", flush=True)
print(run("curl -s -w '\\nHTTP_CODE: %{http_code}\\nSIZE: %{size_download}' http://localhost:3000/_next/static/chunks/0eeqtkeiqodyw.css 2>&1 | tail -5"), flush=True)

print("\n=== HTTPS test with full response ===", flush=True)
i, o, e = ssh.exec_command("curl -s -w 'HTTP_CODE: %{http_code}' -o /tmp/css_test.txt --insecure https://etudiantsmali.ru/_next/static/chunks/0eeqtkeiqodyw.css 2>&1", timeout=15)
o.channel.recv_exit_status()
print(o.read().decode("utf-8", errors="replace").strip(), flush=True)
# Check what's in the file
print(run("head -5 /tmp/css_test.txt 2>&1"), flush=True)

# Check Nginx error log
print("\n=== Nginx error log (last 10) ===", flush=True)
print(run("tail -10 /var/log/nginx/error.log 2>&1"), flush=True)

print("\n=== Nginx access log for the file ===", flush=True)
print(run("grep '0eeqtkeiqodyw' /var/log/nginx/access.log 2>&1"), flush=True)

ssh.close()
