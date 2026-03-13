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

function Build-HeroStack4($data, $svgPath) {
  $width = 1400
  $height = 560
  $leftX = 30

  $brand = Escape-Xml $data.Brand
  $tagline = Escape-Xml $data.Tagline
  $subtitle = Escape-Xml $data.Subtitle

  $imgWordbook = [System.Uri]::new((Resolve-ImagePath $data.Wordbook)).AbsoluteUri
  $imgPopup = [System.Uri]::new((Resolve-ImagePath $data.Popup)).AbsoluteUri
  $imgEbbinghaus = [System.Uri]::new((Resolve-ImagePath $data.Ebbinghaus)).AbsoluteUri
  $imgWallpaper = [System.Uri]::new((Resolve-ImagePath $data.Wallpaper)).AbsoluteUri

  $svg = @"
<svg width=\"$width\" height=\"$height\" viewBox=\"0 0 $width $height\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
  <defs>
    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"$width\" y2=\"$height\" gradientUnits=\"userSpaceOnUse\">
      <stop stop-color=\"#F7F6FF\"/>
      <stop offset=\"1\" stop-color=\"#EEF2FF\"/>
    </linearGradient>
    <filter id=\"shadow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\">
      <feDropShadow dx=\"0\" dy=\"14\" stdDeviation=\"14\" flood-color=\"#1B103A\" flood-opacity=\"0.18\"/>
    </filter>
    <clipPath id=\"clipA\"><rect x=\"360\" y=\"18\" width=\"625\" height=\"350\" rx=\"42\" /></clipPath>
    <clipPath id=\"clipB\"><rect x=\"780\" y=\"28\" width=\"625\" height=\"350\" rx=\"42\" /></clipPath>
    <clipPath id=\"clipC\"><rect x=\"410\" y=\"296\" width=\"588\" height=\"306\" rx=\"40\" /></clipPath>
    <clipPath id=\"clipD\"><rect x=\"860\" y=\"296\" width=\"588\" height=\"306\" rx=\"40\" /></clipPath>
  </defs>

  <rect width=\"$width\" height=\"$height\" fill=\"url(#bg)\"/>
  <circle cx=\"1180\" cy=\"90\" r=\"210\" fill=\"#8B5CF6\" opacity=\"0.08\"/>
  <circle cx=\"1220\" cy=\"500\" r=\"220\" fill=\"#6366F1\" opacity=\"0.06\"/>

  <text x=\"$leftX\" y=\"150\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"50\" font-weight=\"800\" fill=\"#111827\">$brand</text>
  <text x=\"$leftX\" y=\"212\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"30\" font-weight=\"700\" fill=\"#5B3CC4\">$tagline</text>
  <text x=\"$leftX\" y=\"256\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"22\" fill=\"#374151\">$subtitle</text>
  <text x=\"$leftX\" y=\"300\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"18\" fill=\"#4B5563\">采集 → 归档 → 复习 → 输出，形成稳定闭环</text>
  <text x=\"$leftX\" y=\"344\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"13\" fill=\"#6B7280\">Chrome 扩展 · 一次购买 · 长期使用</text>

  <image href=\"$imgWordbook\" x=\"360\" y=\"18\" width=\"625\" height=\"350\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipA)\" filter=\"url(#shadow)\" />
  <image href=\"$imgPopup\" x=\"780\" y=\"28\" width=\"625\" height=\"350\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipB)\" filter=\"url(#shadow)\" />
  <image href=\"$imgEbbinghaus\" x=\"410\" y=\"296\" width=\"588\" height=\"306\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipC)\" filter=\"url(#shadow)\" />
  <image href=\"$imgWallpaper\" x=\"860\" y=\"296\" width=\"588\" height=\"306\" preserveAspectRatio=\"xMidYMid meet\" clip-path=\"url(#clipD)\" filter=\"url(#shadow)\" />

  <text x=\"370\" y=\"16\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\">单词本：分类、批注、来源</text>
  <text x=\"800\" y=\"26\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\">网页弹窗：即点即译、不中断阅读</text>
  <text x=\"420\" y=\"292\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\">艾宾浩斯：节奏复习、进度追踪</text>
  <text x=\"870\" y=\"292\" font-family=\"Microsoft YaHei, PingFang SC, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#5B3CC4\">iPhone 壁纸：锁屏复习、随时记忆</text>
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

  $features += [pscustomobject]@{ Label=$label; Title=$title; Desc=$desc; Image=$img; Caption=$caption }
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

$data = [pscustomobject]@{
  Brand = $brand
  Tagline = $tagline
  Subtitle = $subtitle
  Wordbook = $features[1].Image
  Popup = $features[0].Image
  Ebbinghaus = $features[3].Image
  Wallpaper = 'screens/iPhone壁纸功能/HapiGo_2026-02-05_04.16.17.png'
}

$svgPath = Join-Path $svgDir 'hero-variant-9-1400x560.svg'
Build-HeroStack4 $data $svgPath
Convert-SvgToJpeg $svgPath (Join-Path $jpgDir 'hero-variant-9-1400x560.jpg') 1400 560 $edge

Get-ChildItem -Path $jpgDir -Filter 'hero-variant-9-1400x560.jpg' -File | Select-Object Name,Length,LastWriteTime
