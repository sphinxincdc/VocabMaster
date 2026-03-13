$ErrorActionPreference = 'Stop'
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { throw 'msedge-not-found' }
Add-Type -AssemblyName System.Drawing
$svgs = Get-ChildItem -Path "screens\feature-cards" -Filter *.svg -File
foreach ($svg in $svgs) {
  $jpg = [System.IO.Path]::ChangeExtension($svg.FullName, 'jpg')
  $png = [System.IO.Path]::ChangeExtension($svg.FullName, 'png')
  $name = $svg.BaseName
  $w = 1280; $h = 800
  if ($name -like '*1400x560*') { $w = 1400; $h = 560 }
  elseif ($name -like '*440x280*') { $w = 440; $h = 280 }
  $uri = [System.Uri]::new($svg.FullName).AbsoluteUri
  & $edge --headless --disable-gpu --hide-scrollbars "--window-size=$w,$h" "--screenshot=$png" $uri | Out-Null
  if (-not (Test-Path -LiteralPath $png)) { throw "png-not-created: $png" }
  $img = [System.Drawing.Image]::FromFile($png)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 92L)
  $img.Save($jpg, $codec, $params)
  $img.Dispose()
  Remove-Item -LiteralPath $png -Force
}
Get-ChildItem -Path "screens\feature-cards" -Filter *.jpg -File | Select-Object Name,Length,LastWriteTime
