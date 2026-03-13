$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Escape-Xml($text) {
  if (-not $text) { return '' }
  $text = $text -replace '&', '&amp;'
  $text = $text -replace '<', '&lt;'
  $text = $text -replace '>', '&gt;'
  $text = $text -replace '"', '&quot;'
  return $text
}

function Strip-Tags($text) {
  if (-not $text) { return '' }
  $t = [regex]::Replace($text, '<[^>]+>', '')
  $t = $t -replace '&nbsp;', ' '
  $t = $t -replace '&amp;', '&'
  return $t.Trim()
}

function Split-Desc($text, $maxLines = 2) {
  if (-not $text) { return @() }
  $comma = [char]0xFF0C
  $period = [char]0x3002
  $t = $text -replace '\s+', ''
  $t = $t -replace [regex]::Escape([string]$comma), ([string]$comma + '|')
  $t = $t -replace [regex]::Escape([string]$period), ([string]$period + '|')
  $lines = $t -split '\|' | Where-Object { $_ -and $_.Trim().Length -gt 0 }
  if ($lines.Count -gt $maxLines) { return $lines[0..($maxLines - 1)] }
  return $lines
}

function Resolve-ImagePath($relativePath) {
  $candidate = Join-Path (Get-Location) $relativePath
  if (Test-Path -LiteralPath $candidate) { return $candidate }
  $fileName = [System.IO.Path]::GetFileName($relativePath)
  $match = Get-ChildItem -Recurse -File 'screens' | Where-Object { $_.Name -eq $fileName } | Select-Object -First 1
  if ($match) { return $match.FullName }
  throw "image-not-found: $relativePath"
}

function Get-RelativePath($from, $to) {
  $base = $from.TrimEnd('\') + '\'
  $fromUri = New-Object System.Uri($base)
  $toUri = New-Object System.Uri($to)
  $rel = $fromUri.MakeRelativeUri($toUri).ToString()
  return $rel
}

function Build-FeatureSvg($data, $svgPath, $svgDir) {
  $width = 1280
  $height = 800
  $cardX = 420
  $cardY = 110
  $cardW = 820
  $cardH = 560
  $innerX = 438
  $innerY = 128
  $innerW = 784
  $innerH = 524

  $title = Escape-Xml $data.Title
  $label = Escape-Xml $data.Label
  $caption = Escape-Xml $data.Caption
  $descLines = Split-Desc $data.Desc 2 | ForEach-Object { Escape-Xml $_ }
  $tags = @()
  foreach ($t in $data.Tags) {
    if ($t -and $tags.Count -lt 3) { $tags += (Escape-Xml $t) }
  }

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

  $descTspans = ''
  $descY = 0
  foreach ($line in $descLines) {
    $descTspans += "        <tspan x=`"80`" dy=`"26`">$line</tspan>`n"
    $descY++
  }

  $tagLines = ''
  $tagY = 0
  foreach ($t in $tags) {
    $tagLines += "        <tspan x=`"84`" dy=`"26`">- $t</tspan>`n"
    $tagY++
  }

  $svg = @"
<svg width="$width" height="$height" viewBox="0 0 $width $height" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="$width" y2="$height" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F7F5FF"/>
      <stop offset="1" stop-color="#EEF3FF"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1B103A" flood-opacity="0.16"/>
    </filter>
    <clipPath id="clip">
      <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="22" />
    </clipPath>
  </defs>

  <rect width="$width" height="$height" fill="url(#bg)"/>
  <circle cx="1080" cy="120" r="220" fill="#8B5CF6" opacity="0.08"/>
  <circle cx="1140" cy="700" r="220" fill="#6366F1" opacity="0.07"/>

  <rect x="80" y="118" width="120" height="30" rx="15" fill="#EDE9FE"/>
  <text x="140" y="139" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="12" font-weight="700" fill="#5B3CC4" text-anchor="middle">$label</text>

  <text x="80" y="188" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="700" fill="#111827">$title</text>

  <text x="80" y="232" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="17" fill="#374151">
$descTspans  </text>

  <text x="84" y="320" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="14" fill="#6B7280">
$tagLines  </text>

  <rect x="$cardX" y="$cardY" width="$cardW" height="$cardH" rx="34" fill="white" filter="url(#shadow)"/>
  <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="24" fill="#F3F5FF"/>
  <image href="$imgRel" x="$innerX" y="$innerY" width="$innerW" height="$innerH" preserveAspectRatio="xMidYMid meet" clip-path="url(#clip)" />

  <text x="$innerX" y="690" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="13" fill="#6B7280">$caption</text>
</svg>
"@

  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-HeroSvg($data, $svgPath, $svgDir) {
  $width = 1400
  $height = 560
  $cardX = 700
  $cardY = 70
  $cardW = 640
  $cardH = 420
  $innerX = 718
  $innerY = 88
  $innerW = 604
  $innerH = 384

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle
  $descLines = Split-Desc $data.Desc 2 | ForEach-Object { Escape-Xml $_ }

  $tags = @()
  foreach ($t in $data.Tags) {
    if ($t -and $tags.Count -lt 3) { $tags += (Escape-Xml $t) }
  }

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

  $descTspans = ''
  foreach ($line in $descLines) {
    $descTspans += "        <tspan x=`"80`" dy=`"24`">$line</tspan>`n"
  }

  $pill = ''
  $pillX = 80
  foreach ($t in $tags) {
    $pill += "  <rect x=`"$pillX`" y=`"320`" width=`"110`" height=`"28`" rx=`"14`" fill=`"#EDE9FE`"/>\n"
    $pill += "  <text x=`"" + ($pillX + 55) + "`" y=`"339`" font-family=`"Microsoft YaHei, PingFang SC, sans-serif`" font-size=`"12`" fill=`"#5B3CC4`" text-anchor=`"middle`">$t</text>`n"
    $pillX += 118
  }

  $svg = @"
<svg width="$width" height="$height" viewBox="0 0 $width $height" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="$width" y2="$height" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F7F5FF"/>
      <stop offset="1" stop-color="#EEF3FF"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1B103A" flood-opacity="0.16"/>
    </filter>
    <clipPath id="clip">
      <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="20" />
    </clipPath>
  </defs>

  <rect width="$width" height="$height" fill="url(#bg)"/>
  <circle cx="1160" cy="80" r="220" fill="#8B5CF6" opacity="0.08"/>
  <circle cx="1180" cy="520" r="220" fill="#6366F1" opacity="0.07"/>

  <text x="80" y="140" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="36" font-weight="700" fill="#111827">$brand</text>
  <text x="80" y="178" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="22" font-weight="700" fill="#5B3CC4">$tagline</text>
  <text x="80" y="218" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="18" fill="#374151">$subtitle</text>
  <text x="80" y="248" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="18" fill="#4B5563">
$descTspans  </text>
$pill

  <rect x="$cardX" y="$cardY" width="$cardW" height="$cardH" rx="28" fill="white" filter="url(#shadow)"/>
  <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="22" fill="#F3F5FF"/>
  <image href="$imgRel" x="$innerX" y="$innerY" width="$innerW" height="$innerH" preserveAspectRatio="xMidYMid meet" clip-path="url(#clip)" />
</svg>
"@

  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-PromoSvg($data, $svgPath, $svgDir) {
  $width = 440
  $height = 280
  $cardX = 16
  $cardY = 90
  $cardW = 408
  $cardH = 172
  $innerX = 24
  $innerY = 98
  $innerW = 392
  $innerH = 156

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

  $svg = @"
<svg width="$width" height="$height" viewBox="0 0 $width $height" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="$width" y2="$height" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F7F5FF"/>
      <stop offset="1" stop-color="#EEF3FF"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1B103A" flood-opacity="0.14"/>
    </filter>
    <clipPath id="clip">
      <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="12" />
    </clipPath>
  </defs>

  <rect width="$width" height="$height" fill="url(#bg)"/>
  <text x="16" y="34" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="15" font-weight="700" fill="#111827">$brand</text>
  <text x="16" y="56" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="11" font-weight="700" fill="#5B3CC4">$tagline</text>
  <text x="16" y="76" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="11" fill="#4B5563">$subtitle</text>

  <rect x="$cardX" y="$cardY" width="$cardW" height="$cardH" rx="16" fill="white" filter="url(#shadow)"/>
  <rect x="$innerX" y="$innerY" width="$innerW" height="$innerH" rx="12" fill="#F3F5FF"/>
  <image href="$imgRel" x="$innerX" y="$innerY" width="$innerW" height="$innerH" preserveAspectRatio="xMidYMid meet" clip-path="url(#clip)" />
</svg>
"@

  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Convert-SvgToJpeg($svgPath, $jpgPath, $width, $height, $edgePath) {
  $pngPath = [System.IO.Path]::ChangeExtension($jpgPath, 'png')
  $uri = [System.Uri]::new($svgPath).AbsoluteUri
  $args = @(
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    "--window-size=$width,$height",
    "--screenshot=$pngPath",
    $uri
  )
  & $edgePath @args | Out-Null
  if (-not (Test-Path -LiteralPath $pngPath)) { throw "png-not-created: $pngPath" }

  $img = [System.Drawing.Image]::FromFile($pngPath)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 92L)
  $img.Save($jpgPath, $codec, $params)
  $img.Dispose()
  Remove-Item -LiteralPath $pngPath -Force
}

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) { throw 'msedge-not-found' }

$html = Get-Content -Raw -Encoding UTF8 'index.html'
$featureSection = [regex]::Match($html, '(?s)<section id="features".*?</section>').Value
$articles = [regex]::Matches($featureSection, '(?s)<article.*?</article>')

$features = @()
foreach ($article in $articles) {
  $labelMatch = [regex]::Match($article.Value, '<p[^>]*>Feature\s*\d+</p>')
  $label = Strip-Tags($labelMatch.Value)
  $title = Strip-Tags([regex]::Match($article.Value, '<h3[^>]*>(.*?)</h3>').Groups[1].Value)
  $desc = Strip-Tags([regex]::Match($article.Value, '<p class="mt-3[^"]*">(.*?)</p>').Groups[1].Value)
  $caption = Strip-Tags([regex]::Match($article.Value, '<figcaption[^>]*>(.*?)</figcaption>').Groups[1].Value)
  $img = [regex]::Match($article.Value, 'data-feature-src-light="([^"]+)"').Groups[1].Value

  $spanMatches = [regex]::Matches($article.Value, '<span[^>]*>(.*?)</span>')
  $tags = @()
  foreach ($m in $spanMatches) {
    $text = Strip-Tags($m.Groups[1].Value)
    if ($text) { $tags += $text }
  }

  $features += [pscustomobject]@{
    Label = $label
    Title = $title
    Desc = $desc
    Tags = $tags
    Image = $img
    Caption = $caption
  }
}

if ($features.Count -lt 5) { throw 'need-5-features' }

$heroSection = [regex]::Match($html, '(?s)<section id="top".*?</section>').Value
$brandRaw = [regex]::Match($heroSection, '<span class="block text-slate-900[^"]*">([\s\S]*?)</span>').Groups[1].Value
$brand = Strip-Tags($brandRaw)
$tagline = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block bg-gradient-to-r[^"]*">(.*?)</span>').Groups[1].Value)
$subtitle = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block text-xl[^"]*">(.*?)</span>').Groups[1].Value)
$heroDescRaw = Strip-Tags([regex]::Match($heroSection, '<p class="mt-6 text-lg[^"]*">(.*?)</p>').Groups[1].Value)

$svgDir = Join-Path (Get-Location) 'screens/feature-cards/svg-v5'
$jpgDir = Join-Path (Get-Location) 'screens/feature-cards/v5'
New-Item -ItemType Directory -Force -Path $svgDir | Out-Null
New-Item -ItemType Directory -Force -Path $jpgDir | Out-Null

for ($i = 0; $i -lt 5; $i++) {
  $f = $features[$i]
  $svgPath = Join-Path $svgDir ("feature-0{0}-1280x800.svg" -f ($i + 1))
  Build-FeatureSvg $f $svgPath $svgDir
  $jpgPath = Join-Path $jpgDir ("feature-0{0}-1280x800.jpg" -f ($i + 1))
  Convert-SvgToJpeg $svgPath $jpgPath 1280 800 $edgePath
}

$heroData = [pscustomobject]@{
  Brand = $brand
  Tagline = $tagline
  Subtitle = $subtitle
  Desc = $heroDescRaw
  Image = $features[1].Image
  Tags = $features[0].Tags
}
$heroSvg = Join-Path $svgDir 'hero-1400x560.svg'
Build-HeroSvg $heroData $heroSvg $svgDir
Convert-SvgToJpeg $heroSvg (Join-Path $jpgDir 'hero-1400x560.jpg') 1400 560 $edgePath

$promoData = [pscustomobject]@{
  Brand = $brand
  Tagline = $tagline
  Subtitle = $subtitle
  Image = $features[0].Image
}
$promoSvg = Join-Path $svgDir 'promo-440x280.svg'
Build-PromoSvg $promoData $promoSvg $svgDir
Convert-SvgToJpeg $promoSvg (Join-Path $jpgDir 'promo-440x280.jpg') 440 280 $edgePath
