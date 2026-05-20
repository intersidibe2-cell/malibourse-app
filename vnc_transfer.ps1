$b64 = Get-Content "D:\projets IT\Gestion des etudiants au mali\project.b64" -Raw
$clean = $b64 -replace "-----BEGIN CERTIFICATE-----", "" -replace "-----END CERTIFICATE-----", "" -replace "`r", ""

$lines = @()
$lines += "cat > /root/project.b64 << 'ENDOFB64'"
$lines += $clean.Trim()
$lines += "ENDOFB64"
$lines += "base64 -d /root/project.b64 > /root/project.tar.gz"
$lines += "cd /root && tar -xzf project.tar.gz"
$lines += "rm -f /root/project.b64 /root/project.tar.gz"
$lines += "echo 'OK - FILES EXTRACTED'"

$script = $lines -join "`n"
Set-Clipboard -Value $script
Write-Host "Script copied to clipboard!"
Write-Host "Size: $($script.Length) characters"
