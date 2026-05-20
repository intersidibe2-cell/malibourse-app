import urllib.request
import json
import io

file_path = r"D:\projets IT\Gestion des etudiants au mali\project.tar.gz"

with open(file_path, "rb") as f:
    data = f.read()

# Try uguu.se
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = io.BytesIO()
body.write(f"--{boundary}\r\n".encode())
body.write(b'Content-Disposition: form-data; name="files[]"; filename="project.tar.gz"\r\n')
body.write(b"Content-Type: application/octet-stream\r\n\r\n")
body.write(data)
body.write(f"\r\n--{boundary}--\r\n".encode())

req = urllib.request.Request("https://uguu.se/upload", data=body.getvalue(), method="POST")
req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
req.add_header("User-Agent", "Mozilla/5.0")
try:
    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read())
    print(f"UPLOAD_RESULT: {result}")
    if isinstance(result, list) and len(result) > 0 and "url" in result[0]:
        print(f"DOWNLOAD_URL: {result[0]['url']}")
    elif isinstance(result, dict) and "success" in result and result["success"]:
        print(f"DOWNLOAD_URL: {result.get('files')[0].get('url')}")
    else:
        print(f"Unknown response format: {result}")
except Exception as e:
    print(f"uguu.se failed: {e}")

# Try alternative - file.io
try:
    req2 = urllib.request.Request("https://file.io", data=data, method="POST")
    req2.add_header("Content-Type", "application/octet-stream")
    req2.add_header("User-Agent", "Mozilla/5.0")
    resp2 = urllib.request.urlopen(req2, timeout=120)
    result2 = json.loads(resp2.read())
    print(f"FILEIO_RESULT: {result2}")
except Exception as e2:
    print(f"file.io failed: {e2}")
