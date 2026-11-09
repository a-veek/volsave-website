# Renders tools/og-image.html to src/assets/img/og-{de,en,es}.png (1200x630)
# with headless Microsoft Edge. Run from Windows PowerShell:
#   powershell -ExecutionPolicy Bypass -File tools\og-images.ps1

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Edge cannot always open files on \\wsl.localhost directly; render a local copy.
$tmp = Join-Path $env:TEMP 'volsave-og'
New-Item -ItemType Directory -Force $tmp | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'og-image.html') (Join-Path $tmp 'og-image.html') -Force
$src = ([Uri](Join-Path $tmp 'og-image.html')).AbsoluteUri

foreach ($lang in 'de', 'en', 'es') {
  $png = Join-Path $tmp "og-$lang.png"
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --window-size=1200,630 --user-data-dir="$tmp\profile" `
    --screenshot="$png" "$src`?lang=$lang" | Out-Null
  Copy-Item $png (Join-Path $repo "src\assets\img\og-$lang.png") -Force
  Write-Output "og-$lang.png"
}
