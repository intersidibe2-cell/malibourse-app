import paramiko
import sys
import io
import time

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
            print(f"  {line}", flush=True)
    if exit_code != 0 and err:
        print(f"  ERR: {err[-300:]}", flush=True)
    return out, exit_code

print("Installing SSL certificate...", flush=True)
run("certbot --nginx -d etudiantsmali.ru -d www.etudiantsmali.ru --non-interactive --agree-tos -m sidibe3131@mail.ru 2>&1", timeout=120)

time.sleep(3)

# Test HTTPS
print("\nTesting HTTPS...", flush=True)
out, code = run("curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1")
print(f"HTTPS status: {out}", flush=True)

# Show certificates
print("\nInstalled certificates:", flush=True)
out, code = run("certbot certificates 2>&1 | head -15")
print(out, flush=True)

ssh.close()
print("\nSSL Setup Complete!", flush=True)
