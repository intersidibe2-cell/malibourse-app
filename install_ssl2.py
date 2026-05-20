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
        print(f"  {out[:300]}", flush=True)
    if exit_code != 0 and err:
        print(f"  ERR: {err[:300]}", flush=True)
    return out, exit_code

# Check IPv6
print("=== IPv6 Check ===", flush=True)
run("ip -6 addr show 2>/dev/null | grep inet6 | head -3")

# Retry certbot with HTTP-01 challenge
print("\n=== Certbot SSL ===", flush=True)
retry_cmd = "certbot --nginx -d etudiantsmali.ru -d www.etudiantsmali.ru --non-interactive --agree-tos -m sidibe3131@mail.ru --preferred-challenges http 2>&1"
out, code = run(retry_cmd, timeout=120)
print(f"Exit code: {code}", flush=True)

time.sleep(3)

# Test HTTPS
print("\n=== Testing HTTPS ===", flush=True)
https_check = "curl -s -o /dev/null -w '%{http_code}' https://etudiantsmali.ru/ 2>&1"
out, code = run(https_check)
print(f"HTTPS: {out}", flush=True)

# Show certificates
print("\n=== Certificates ===", flush=True)
run("certbot certificates 2>&1 | head -20")

ssh.close()
print("\nDone!", flush=True)
