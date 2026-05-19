import urllib.request
import os
import json
import io

file_path = r"D:\projets IT\Gestion des etudiants au mali\project.tar.gz"
print(f"File size: {os.path.getsize(file_path)/1024/1024:.1f} MB")

with open(file_path, "rb") as f:
    data = f.read()

# Try temp.sh
try:
    req = urllib.request.Request("https://temp.sh/upload", data=data, method="POST")
    req.add_header("Content-Type", "application/octet-stream")
    resp = urllib.request.urlopen(req, timeout=120)
    result = resp.read().decode().strip()
    print(f"DOWNLOAD_URL: {result}")
except Exception as e:
    print(f"temp.sh failed: {e}")

# Try filebin.net
try:
    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    body = io.BytesIO()
    body.write(f"--{boundary}\r\n".encode())
    body.write(b'Content-Disposition: form-data; name="file"; filename="project.tar.gz"\r\n')
    body.write(b"Content-Type: application/octet-stream\r\n\r\n")
    body.write(data)
    body.write(f"\r\n--{boundary}--\r\n".encode())

    req = urllib.request.Request("https://filebin.net/anon/malibourse-project.tar.gz", data=body.getvalue(), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("User-Agent", "Mozilla/5.0")
    resp = urllib.request.urlopen(req, timeout=120)
    result_url = resp.url
    print(f"DOWNLOAD_URL: {result_url}")
except Exception as e:
    print(f"filebin.net failed: {e}")
