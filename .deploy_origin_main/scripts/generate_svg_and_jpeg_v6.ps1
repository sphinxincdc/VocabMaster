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
  $base = $from.TrimEnd('\\') + '\\'
  $fromUri = New-Object System.Uri($base)
  $toUri = New-Object System.Uri($to)
  $rel = $fromUri.MakeRelativeUri($toUri).ToString()
  return $rel
}

function Estimate-TextWidth($text, $fontSize) {
  if (-not $text) { return 0 }
  $w = 0.0
  foreach ($ch in $text.ToCharArray()) {
    $code = [int][char]$ch
    if ($code -ge 0x2E80) {
      $w += $fontSize * 0.95
    } else {
      $w += $fontSize * 0.55
    }
  }
  return [math]::Round($w)
}

function Build-TagPills($tags, $startX, $startY, $maxWidth, $fontSize) {
  $pillH = 26
  $hGap = 8
  $vGap = 8
  $x = $startX
  $y = $startY
  $svg = ''
  foreach ($t in $tags) {
    if (-not $t) { continue }
    $text = Escape-Xml $t
    $w = (Estimate-TextWidth $t $fontSize) + 20
    if (($x + $w) -gt ($startX + $maxWidth)) {
      $x = $startX
      $y += ($pillH + $vGap)
    }
    $svg += "  <rect x=`"$x`" y=`"$y`" width=`"$w`" height=`"$pillH`" rx=`"13`" fill=`"#EEF2FF`" stroke=`"#E2E8F0`"/>`n"
    $textX = $x + ($w / 2)
    $textY = $y + ($pillH / 2)
    $svg += "  <text x=`"$textX`" y=`"$textY`" font-family=`"Microsoft YaHei, PingFang SC, sans-serif`" font-size=`"$fontSize`" font-weight=`"600`" fill=`"#5B3CC4`" text-anchor=`"middle`" dominant-baseline=`"middle`">$text</text>`n"
    $x += $w + $hGap
  }
  return $svg
}

function Build-FeatureSvg($data, $svgPath, $svgDir) {
  $width = 1280
  $height = 800
  $leftX = 70
  $leftColWidth = 320
  $cardX = 360
  $cardY = 110
  $cardW = 860
  $cardH = 580
  $innerPad = 18
  $innerX = $cardX + $innerPad
  $innerY = $cardY + $innerPad
  $innerW = $cardW - ($innerPad * 2)
  $innerH = $cardH - ($innerPad * 2)

  $title = Escape-Xml $data.Title
  $label = Escape-Xml $data.Label
  $caption = Escape-Xml $data.Caption
  $descLines = Split-Desc $data.Desc 2 | ForEach-Object { Escape-Xml $_ }

  $tags = @()
  foreach ($t in $data.Tags) {
    if ($t -and $tags.Count -lt 3) { $tags += $t }
  }

  $descLineHeight = 24
  $descY = 248
  $descTspans = ''
  $first = $true
  foreach ($line in $descLines) {
    if ($first) {
      $descTspans += "        <tspan x=`"$leftX`" dy=`"0`">$line</tspan>`n"
      $first = $false
    } else {
      $descTspans += "        <tspan x=`"$leftX`" dy=`"$descLineHeight`">$line</tspan>`n"
    }
  }
  $tagsY = $descY + (($descLines.Count) * $descLineHeight) + 20
  $tagsSvg = Build-TagPills $tags $leftX $tagsY $leftColWidth 12

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

$svg = @"
<svg width=\"$width\" height=\"$height\" viewBox=\"0 0 $width $height\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"$width\" y2=\"$height\" gradientUnits=\"userSpaceOnUse\">
      <stop stop-color=\"#F7F6FF\"/>
      <stop offset=\"1\" stop-color=\"#EEF2FF\"/>
    </linearGradient>
    <filter id=\"shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">
      <feDropShadow dx=\"0\" dy=\"18\" stdDeviation=\"18\" flood-color=\"#1B103A\" flood-opacity=\"0.16\"/>
    </filter>
    <clipPath id=\"clip\">
      <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"24\" />
    </clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"1140\" cy=\"140\" r=\"220\" fill=\"#8B5CF6\" opacity=\"0.08\"/>
  <circle cx=\"1180\" cy=\"680\" r=\"220\" fill=\"#6366F1\" opacity=\"0.06\"/>

  <rect x=\"$leftX\" y=\"150\" width=\"110\" height=\"26\" rx=\"13\" fill=\"#EEF2FF\" stroke=\"#E2E8F0\"/>
  <text x=\"$($leftX + 55)\" y=\"163\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"#5B3CC4\" text-anchor=\"middle\" dominant-baseline=\"middle\">$label</text>

  <text x=\"$leftX\" y=\"210\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"32\" font-weight=\"700\" fill=\"#111827\">$title</text>

  <text x=\"$leftX\" y=\"$descY\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"16\" fill=\"#4B5563\">
$descTspans  </text>

$tagsSvg

  <rect x=\"$cardX\" y=\"$cardY\" width=\"$cardW\" height=\"$cardH\" rx=\"34\" fill=\"white\" filter=\"url(#shadow)\"/>
  <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"24\" fill=\"#F4F6FF\" stroke=\"#E6E9F8\"/>
  <image href=\"$imgRel\" x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clip)\" />

  <text x=\"$innerX\" y=\"$($cardY + $cardH + 28)\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"13\" fill=\"#6B7280\">$caption</text>
</svg>
"@
  $svg = $svg -replace '\\\"', '"'

  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-HeroSvg($data, $svgPath, $svgDir) {
  $width = 1400
  $height = 560
  $leftX = 80
  $leftColWidth = 520
  $cardX = 600
  $cardY = 70
  $cardW = 760
  $cardH = 420
  $innerPad = 14
  $innerX = $cardX + $innerPad
  $innerY = $cardY + $innerPad
  $innerW = $cardW - ($innerPad * 2)
  $innerH = $cardH - ($innerPad * 2)

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle
  $descLines = Split-Desc $data.Desc 2 | ForEach-Object { Escape-Xml $_ }

  $tags = @()
  foreach ($t in $data.Tags) {
    if ($t -and $tags.Count -lt 3) { $tags += $t }
  }

  $descLineHeight = 22
  $descY = 276
  $descTspans = ''
  $first = $true
  foreach ($line in $descLines) {
    if ($first) {
      $descTspans += "        <tspan x=`"$leftX`" dy=`"0`">$line</tspan>`n"
      $first = $false
    } else {
      $descTspans += "        <tspan x=`"$leftX`" dy=`"$descLineHeight`">$line</tspan>`n"
    }
  }
  $tagsY = $descY + (($descLines.Count) * $descLineHeight) + 18
  $tagsSvg = Build-TagPills $tags $leftX $tagsY $leftColWidth 12

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

$svg = @"
<svg width=\"$width\" height=\"$height\" viewBox=\"0 0 $width $height\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"$width\" y2=\"$height\" gradientUnits=\"userSpaceOnUse\">
      <stop stop-color=\"#F7F6FF\"/>
      <stop offset=\"1\" stop-color=\"#EEF2FF\"/>
    </linearGradient>
    <filter id=\"shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">
      <feDropShadow dx=\"0\" dy=\"16\" stdDeviation=\"16\" flood-color=\"#1B103A\" flood-opacity=\"0.16\"/>
    </filter>
    <clipPath id=\"clip\">
      <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"20\" />
    </clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"1180\" cy=\"90\" r=\"200\" fill=\"#8B5CF6\" opacity=\"0.08\"/>
  <circle cx=\"1210\" cy=\"500\" r=\"210\" fill=\"#6366F1\" opacity=\"0.06\"/>

  <text x=\"$leftX\" y=\"170\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"34\" font-weight=\"700\" fill=\"#111827\">$brand</text>
  <text x=\"$leftX\" y=\"210\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"20\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"$leftX\" y=\"244\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"16\" fill=\"#374151\">$subtitle</text>
  <text x=\"$leftX\" y=\"$descY\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"14\" fill=\"#4B5563\">
$descTspans  </text>

$tagsSvg

  <rect x=\"$cardX\" y=\"$cardY\" width=\"$cardW\" height=\"$cardH\" rx=\"28\" fill=\"white\" filter=\"url(#shadow)\"/>
  <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"22\" fill=\"#F4F6FF\" stroke=\"#E6E9F8\"/>
  <image href=\"$imgRel\" x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clip)\" />
</svg>
"@
  $svg = $svg -replace '\\\"', '"'

  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-PromoSvg($data, $svgPath, $svgDir) {
  $width = 440
  $height = 280
  $cardX = 14
  $cardY = 80
  $cardW = 412
  $cardH = 186
  $innerPad = 10
  $innerX = $cardX + $innerPad
  $innerY = $cardY + $innerPad
  $innerW = $cardW - ($innerPad * 2)
  $innerH = $cardH - ($innerPad * 2)

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgFull = Resolve-ImagePath $data.Image
  $imgRel = Get-RelativePath $svgDir $imgFull

$svg = @"
<svg width=\"$width\" height=\"$height\" viewBox=\"0 0 $width $height\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"$width\" y2=\"$height\" gradientUnits=\"userSpaceOnUse\">
      <stop stop-color=\"#F7F6FF\"/>
      <stop offset=\"1\" stop-color=\"#EEF2FF\"/>
    </linearGradient>
    <filter id=\"shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">
      <feDropShadow dx=\"0\" dy=\"10\" stdDeviation=\"10\" flood-color=\"#1B103A\" flood-opacity=\"0.14\"/>
    </filter>
    <clipPath id=\"clip\">
      <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"12\" />
    </clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"360\" cy=\"30\" r=\"70\" fill=\"#8B5CF6\" opacity=\"0.08\"/>

  <text x=\"14\" y=\"30\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"14\" font-weight=\"700\" fill=\"#111827\">$brand</text>
  <text x=\"14\" y=\"50\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"14\" y=\"68\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"11\" fill=\"#4B5563\">$subtitle</text>

  <rect x=\"$cardX\" y=\"$cardY\" width=\"$cardW\" height=\"$cardH\" rx=\"16\" fill=\"white\" filter=\"url(#shadow)\"/>
  <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"12\" fill=\"#F4F6FF\" stroke=\"#E6E9F8\"/>
  <image href=\"$imgRel\" x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clip)\" />
</svg>
"@
  $svg = $svg -replace '\\\"', '"'

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
  $desc = Strip-Tags([regex]::Match($article.Value, '(?s)<p class="mt-3[^\"]*">(.*?)</p>').Groups[1].Value)
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
$brandRaw = [regex]::Match($heroSection, '<span class="block text-slate-900[^\"]*">([\s\S]*?)</span>').Groups[1].Value
$brand = Strip-Tags($brandRaw)
$tagline = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block bg-gradient-to-r[^\"]*">(.*?)</span>').Groups[1].Value)
$subtitle = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block text-xl[^\"]*">(.*?)</span>').Groups[1].Value)
$heroDescRaw = Strip-Tags([regex]::Match($heroSection, '(?s)<p class="mt-6 text-lg[^\"]*">(.*?)</p>').Groups[1].Value)

$svgDir = Join-Path (Get-Location) 'screens/feature-cards/svg-v6'
$jpgDir = Join-Path (Get-Location) 'screens/feature-cards/v6'
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
