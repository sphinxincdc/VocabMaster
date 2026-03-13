$ErrorActionPreference = 'Stop'
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { throw 'msedge-not-found' }
Add-Type -AssemblyName System.Drawing
$svg = Resolve-Path "screens\feature-cards\svg-hero-variants\hero-variant-8-1400x560.svg"
$jpgDir = Resolve-Path "screens\feature-cards\hero-variants"
$jpg = Join-Path $jpgDir.Path "hero-variant-8-1400x560.jpg"
$png = Join-Path $jpgDir.Path "hero-variant-8-1400x560.png"
$uri = [System.Uri]::new($svg.Path).AbsoluteUri
& $edge --headless --disable-gpu --hide-scrollbars "--window-size=1400,560" "--screenshot=$png" $uri | Out-Null
if (-not (Test-Path -LiteralPath $png)) { throw "png-not-created: $png" }
$img = [System.Drawing.Image]::FromFile($png)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 92L)
$img.Save($jpg, $codec, $params)
$img.Dispose()
Remove-Item -LiteralPath $png -Force
Get-Item -Path $jpg | Select-Object Name,Length,LastWriteTime
