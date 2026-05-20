import paramiko, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("130.49.148.253", 22, "root", "dvfHuqlxyO5mh6o2", timeout=30)
print("Connected!", flush=True)

def run(cmd, timeout=120):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        for line in out.split("\n")[-10:]:
            print("  " + line, flush=True)
    if exit_code != 0 and err:
        print("  ERR: " + err[-300:], flush=True)
    return out, exit_code

print("=== Installing SSL via Nginx ===", flush=True)
out, code = run("certbot --nginx -d etudiantsmali.ru -d www.etudiantsmali.ru --non-interactive --agree-tos -m sidibe3131@mail.ru 2>&1", timeout=120)
print(f"Exit code: {code}", flush=True)

time.sleep(3)

print("\n=== Testing HTTPS ===", flush=True)
out, code = run("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1", timeout=15)
print(f"HTTPS: {out}", flush=True)

print("\n=== Certificates ===", flush=True)
run("certbot certificates 2>&1")

print("\n=== Nginx SSL config ===", flush=True)
run("cat /etc/nginx/sites-available/etudiantsmali.ru")

ssh.close()
print("\nSSL Setup Complete!", flush=True)
