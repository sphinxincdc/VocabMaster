$ErrorActionPreference = 'Stop'
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { throw 'msedge-not-found' }
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

function Build-HeroVariant1($data, $svgPath, $svgDir) {
  $width = 1400
  $height = 560
  $leftX = 60
  $cardX = 560
  $cardY = 70
  $cardW = 780
  $cardH = 420
  $innerPad = 14
  $innerX = $cardX + $innerPad
  $innerY = $cardY + $innerPad
  $innerW = $cardW - ($innerPad * 2)
  $innerH = $cardH - ($innerPad * 2)

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgFull = Resolve-ImagePath $data.ImageMain
  $imgHref = [System.Uri]::new($imgFull).AbsoluteUri

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

  <text x=\"$leftX\" y=\"160\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"36\" font-weight=\"700\" fill=\"#111827\">$brand</text>
  <text x=\"$leftX\" y=\"200\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"22\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"$leftX\" y=\"238\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"18\" fill=\"#374151\">$subtitle</text>
  <text x=\"$leftX\" y=\"276\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"16\" fill=\"#4B5563\">划词即懂 · 节奏复习 · 金句沉淀</text>

  <rect x=\"$leftX\" y=\"318\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#EEF2FF\" stroke=\"#E2E8F0\"/>
  <text x=\"$($leftX + 48)\" y=\"332\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\" text-anchor=\"middle\" dominant-baseline=\"middle\">划词翻译</text>
  <rect x=\"$($leftX + 108)\" y=\"318\" width=\"84\" height=\"28\" rx=\"14\" fill=\"#EEF2FF\" stroke=\"#E2E8F0\"/>
  <text x=\"$($leftX + 150)\" y=\"332\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\" text-anchor=\"middle\" dominant-baseline=\"middle\">单词本</text>
  <rect x=\"$($leftX + 204)\" y=\"318\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#EEF2FF\" stroke=\"#E2E8F0\"/>
  <text x=\"$($leftX + 252)\" y=\"332\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\" text-anchor=\"middle\" dominant-baseline=\"middle\">艾宾浩斯</text>

  <text x=\"$leftX\" y=\"372\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" fill=\"#6B7280\">Chrome 扩展 · 一次购买 · 长期使用</text>

  <rect x=\"$cardX\" y=\"$cardY\" width=\"$cardW\" height=\"$cardH\" rx=\"28\" fill=\"white\" filter=\"url(#shadow)\"/>
  <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"22\" fill=\"#F4F6FF\" stroke=\"#E6E9F8\"/>
  <image href=\"$imgHref\" x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clip)\" />
</svg>
"@

  $svg = $svg -replace '\\"', '"'
  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-HeroVariant2($data, $svgPath, $svgDir) {
  $width = 1400
  $height = 560
  $leftX = 60
  $cardX = 460
  $cardY = 70
  $cardW = 880
  $cardH = 420
  $innerPad = 14
  $innerX = $cardX + $innerPad
  $innerY = $cardY + $innerPad
  $innerW = $cardW - ($innerPad * 2)
  $innerH = $cardH - ($innerPad * 2)

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgMain = Resolve-ImagePath $data.ImageMain
  $imgSecondary1 = Resolve-ImagePath $data.ImageSmall1
  $imgSecondary2 = Resolve-ImagePath $data.ImageSmall2
  $imgRelMain = [System.Uri]::new($imgMain).AbsoluteUri
  $imgRel1 = [System.Uri]::new($imgSecondary1).AbsoluteUri
  $imgRel2 = [System.Uri]::new($imgSecondary2).AbsoluteUri

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
    <clipPath id=\"clipMain\">
      <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"22\" />
    </clipPath>
    <clipPath id=\"clipSmall1\">
      <rect x=\"$($cardX + 30)\" y=\"$($cardY + 28)\" width=\"190\" height=\"125\" rx=\"14\" />
    </clipPath>
    <clipPath id=\"clipSmall2\">
      <rect x=\"$($cardX + 60)\" y=\"$($cardY + 220)\" width=\"210\" height=\"135\" rx=\"14\" />
    </clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"1160\" cy=\"100\" r=\"210\" fill=\"#8B5CF6\" opacity=\"0.08\"/>
  <circle cx=\"1210\" cy=\"510\" r=\"220\" fill=\"#6366F1\" opacity=\"0.06\"/>

  <text x=\"$leftX\" y=\"150\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"34\" font-weight=\"700\" fill=\"#111827\">$brand</text>
  <text x=\"$leftX\" y=\"188\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"20\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"$leftX\" y=\"222\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"16\" fill=\"#374151\">$subtitle</text>
  <text x=\"$leftX\" y=\"256\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"14\" fill=\"#4B5563\">用更稳定的采集节奏 + 复习闭环</text>

  <rect x=\"$cardX\" y=\"$cardY\" width=\"$cardW\" height=\"$cardH\" rx=\"28\" fill=\"white\" filter=\"url(#shadow)\"/>
  <rect x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" rx=\"22\" fill=\"#F4F6FF\" stroke=\"#E6E9F8\"/>
  <image href=\"$imgRelMain\" x=\"$innerX\" y=\"$innerY\" width=\"$innerW\" height=\"$innerH\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipMain)\" />

  <rect x=\"$($cardX + 24)\" y=\"$($cardY + 22)\" width=\"200\" height=\"135\" rx=\"14\" fill=\"white\" filter=\"url(#shadow)\"/>
  <image href=\"$imgRel1\" x=\"$($cardX + 30)\" y=\"$($cardY + 28)\" width=\"190\" height=\"125\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipSmall1)\" />

  <rect x=\"$($cardX + 54)\" y=\"$($cardY + 214)\" width=\"220\" height=\"145\" rx=\"14\" fill=\"white\" filter=\"url(#shadow)\"/>
  <image href=\"$imgRel2\" x=\"$($cardX + 60)\" y=\"$($cardY + 220)\" width=\"210\" height=\"135\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipSmall2)\" />
</svg>
"@

  $svg = $svg -replace '\\"', '"'
  Set-Content -Path $svgPath -Value $svg -Encoding UTF8
}

function Build-HeroVariant3($data, $svgPath, $svgDir) {
  $width = 1400
  $height = 560
  $leftX = 60
  $cardY = 90

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgMain = Resolve-ImagePath $data.ImageMain
  $imgSecondary1 = Resolve-ImagePath $data.ImageSmall1
  $imgSecondary2 = Resolve-ImagePath $data.ImageSmall2
  $imgRelMain = [System.Uri]::new($imgMain).AbsoluteUri
  $imgRel1 = [System.Uri]::new($imgSecondary1).AbsoluteUri
  $imgRel2 = [System.Uri]::new($imgSecondary2).AbsoluteUri

  $svg = @"
<svg width=\"$width\" height=\"$height\" viewBox=\"0 0 $width $height\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"$width\" y2=\"$height\" gradientUnits=\"userSpaceOnUse\">
      <stop stop-color=\"#F7F6FF\"/>
      <stop offset=\"1\" stop-color=\"#EEF2FF\"/>
    </linearGradient>
    <filter id=\"shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">
      <feDropShadow dx=\"0\" dy=\"14\" stdDeviation=\"14\" flood-color=\"#1B103A\" flood-opacity=\"0.16\"/>
    </filter>
    <clipPath id=\"clipA\"><rect x=\"540\" y=\"$cardY\" width=\"340\" height=\"250\" rx=\"18\" /></clipPath>
    <clipPath id=\"clipB\"><rect x=\"890\" y=\"$cardY\" width=\"340\" height=\"250\" rx=\"18\" /></clipPath>
    <clipPath id=\"clipC\"><rect x=\"700\" y=\"$($cardY + 160)\" width=\"340\" height=\"250\" rx=\"18\" /></clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"1180\" cy=\"90\" r=\"200\" fill=\"#8B5CF6\" opacity=\"0.08\"/>
  <circle cx=\"1200\" cy=\"500\" r=\"210\" fill=\"#6366F1\" opacity=\"0.06\"/>

  <text x=\"$leftX\" y=\"150\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"34\" font-weight=\"700\" fill=\"#111827\">$brand</text>
  <text x=\"$leftX\" y=\"190\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"20\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"$leftX\" y=\"224\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"16\" fill=\"#374151\">$subtitle</text>
  <text x=\"$leftX\" y=\"258\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"14\" fill=\"#4B5563\">多界面串联：采集 → 归档 → 复习</text>

  <rect x=\"530\" y=\"$($cardY - 8)\" width=\"360\" height=\"270\" rx=\"20\" fill=\"white\" filter=\"url(#shadow)\"/>
  <image href=\"$imgRelMain\" x=\"540\" y=\"$cardY\" width=\"340\" height=\"250\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipA)\" />

  <rect x=\"880\" y=\"$($cardY - 8)\" width=\"360\" height=\"270\" rx=\"20\" fill=\"white\" filter=\"url(#shadow)\"/>
  <image href=\"$imgRel1\" x=\"890\" y=\"$cardY\" width=\"340\" height=\"250\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipB)\" />

  <rect x=\"690\" y=\"$($cardY + 152)\" width=\"360\" height=\"270\" rx=\"20\" fill=\"white\" filter=\"url(#shadow)\"/>
  <image href=\"$imgRel2\" x=\"700\" y=\"$($cardY + 160)\" width=\"340\" height=\"250\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipC)\" />
</svg>
"@

  $svg = $svg -replace '\\"', '"'
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

  $features += [pscustomobject]@{ Label=$label; Title=$title; Desc=$desc; Tags=$tags; Image=$img; Caption=$caption }
}

$heroSection = [regex]::Match($html, '(?s)<section id="top".*?</section>').Value
$brandRaw = [regex]::Match($heroSection, '<span class="block text-slate-900[^\"]*">([\s\S]*?)</span>').Groups[1].Value
$brand = Strip-Tags($brandRaw)
$tagline = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block bg-gradient-to-r[^\"]*">(.*?)</span>').Groups[1].Value)
$subtitle = Strip-Tags([regex]::Match($heroSection, '<span class="mt-3 block text-xl[^\"]*">(.*?)</span>').Groups[1].Value)

$svgDir = Join-Path (Get-Location) 'screens/feature-cards/svg-hero-variants'
$jpgDir = Join-Path (Get-Location) 'screens/feature-cards/hero-variants'
New-Item -ItemType Directory -Force -Path $svgDir | Out-Null
New-Item -ItemType Directory -Force -Path $jpgDir | Out-Null

$heroData = [pscustomobject]@{
  Brand = $brand
  Tagline = $tagline
  Subtitle = $subtitle
  ImageMain = $features[1].Image
  ImageSmall1 = $features[0].Image
  ImageSmall2 = $features[2].Image
}

$svg1 = Join-Path $svgDir 'hero-variant-1-1400x560.svg'
Build-HeroVariant1 $heroData $svg1 $svgDir
Convert-SvgToJpeg $svg1 (Join-Path $jpgDir 'hero-variant-1-1400x560.jpg') 1400 560 $edge

$svg2 = Join-Path $svgDir 'hero-variant-2-1400x560.svg'
Build-HeroVariant2 $heroData $svg2 $svgDir
Convert-SvgToJpeg $svg2 (Join-Path $jpgDir 'hero-variant-2-1400x560.jpg') 1400 560 $edge

$svg3 = Join-Path $svgDir 'hero-variant-3-1400x560.svg'
Build-HeroVariant3 $heroData $svg3 $svgDir
Convert-SvgToJpeg $svg3 (Join-Path $jpgDir 'hero-variant-3-1400x560.jpg') 1400 560 $edge

Get-ChildItem -Path $jpgDir -Filter *.jpg -File | Select-Object Name,Length,LastWriteTime
