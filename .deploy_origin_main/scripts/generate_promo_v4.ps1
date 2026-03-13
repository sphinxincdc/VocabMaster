$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath([System.Drawing.RectangleF]$rect, [float]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diam = $radius * 2
  $arc = New-Object System.Drawing.RectangleF($rect.X, $rect.Y, $diam, $diam)
  $path.AddArc($arc, 180, 90)
  $arc.X = $rect.Right - $diam
  $path.AddArc($arc, 270, 90)
  $arc.Y = $rect.Bottom - $diam
  $path.AddArc($arc, 0, 90)
  $arc.X = $rect.X
  $path.AddArc($arc, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-RoundedRect($g, $rect, $radius, $fillColor, $borderColor = $null, $borderWidth = 1) {
  $path = New-RoundedRectPath $rect $radius
  $brush = New-Object System.Drawing.SolidBrush($fillColor)
  $g.FillPath($brush, $path)
  if ($borderColor) {
    $pen = New-Object System.Drawing.Pen($borderColor, $borderWidth)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
  }
  $brush.Dispose()
  $path.Dispose()
}

function Draw-ImageContain($g, $img, $rect) {
  $imgRatio = $img.Width / [double]$img.Height
  $rectRatio = $rect.Width / [double]$rect.Height
  if ($imgRatio -gt $rectRatio) {
    $drawWidth = $rect.Width
    $drawHeight = $rect.Width / $imgRatio
  } else {
    $drawHeight = $rect.Height
    $drawWidth = $rect.Height * $imgRatio
  }
  $x = $rect.X + ($rect.Width - $drawWidth) / 2
  $y = $rect.Y + ($rect.Height - $drawHeight) / 2
  $g.DrawImage($img, $x, $y, $drawWidth, $drawHeight)
}

function Save-Jpeg($bmp, $path, $quality = 92L) {
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $quality)
  $bmp.Save($path, $codec, $params)
}

function Strip-Tags($text) {
  if (-not $text) { return '' }
  $t = [regex]::Replace($text, '<[^>]+>', '')
  $t = $t -replace '&nbsp;', ' '
  $t = $t -replace '&amp;', '&'
  return $t.Trim()
}

function Wrap-Text($g, $text, $font, $maxWidth, $maxLines = 2) {
  if (-not $text) { return @() }
  $chars = $text.ToCharArray()
  $lines = New-Object System.Collections.Generic.List[string]
  $current = ''
  foreach ($ch in $chars) {
    $test = $current + $ch
    $size = $g.MeasureString($test, $font)
    if ($size.Width -gt $maxWidth -and $current.Length -gt 0) {
      $lines.Add($current)
      $current = [string]$ch
      if ($lines.Count -ge $maxLines) { break }
    } else {
      $current = $test
    }
  }
  if ($lines.Count -lt $maxLines -and $current.Length -gt 0) {
    $lines.Add($current)
  }
  if ($lines.Count -gt $maxLines) {
    $lines = $lines[0..($maxLines - 1)]
  }
  if ($lines.Count -eq $maxLines) {
    $last = $lines[$maxLines - 1]
    if ($last.Length -gt 1 -and ($chars.Length -gt ($lines[0].Length + $last.Length))) {
      $lines[$maxLines - 1] = $last.Substring(0, [Math]::Max(1, $last.Length - 1)) + '...'
    }
  }
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

function Draw-SoftBackground($g, $width, $height) {
  $bgRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.ColorTranslator]::FromHtml('#F7F5FF'), [System.Drawing.ColorTranslator]::FromHtml('#EEF3FF'), 45)
  $g.FillRectangle($bgBrush, $bgRect)

  $blob1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 139, 92, 246))
  $blob2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(14, 59, 130, 246))
  $g.FillEllipse($blob1, $width - 420, -120, 420, 420)
  $g.FillEllipse($blob2, $width - 340, $height - 260, 360, 260)
  $blob1.Dispose(); $blob2.Dispose()
}

function Draw-Pill($g, $rect, $fillColor, $text, $font, $textColor) {
  Draw-RoundedRect $g $rect 999 $fillColor $null
  $size = $g.MeasureString($text, $font)
  $tx = $rect.X + ($rect.Width - $size.Width) / 2
  $ty = $rect.Y + ($rect.Height - $size.Height) / 2 - 1
  $g.DrawString($text, $font, [System.Drawing.SolidBrush]::new($textColor), $tx, $ty)
}

function New-FeatureCardV4($outPath, $featureLabel, $title, $desc, $tags, $imagePath, $caption) {
  $width = 1280
  $height = 800
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  Draw-SoftBackground $g $width $height

  $fontLabel = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
  $fontTitle = New-Object System.Drawing.Font('Microsoft YaHei', 34, [System.Drawing.FontStyle]::Bold)
  $fontDesc = New-Object System.Drawing.Font('Microsoft YaHei', 17)
  $fontTag = New-Object System.Drawing.Font('Microsoft YaHei', 14)
  $fontSmall = New-Object System.Drawing.Font('Microsoft YaHei', 13)

  $labelRect = New-Object System.Drawing.RectangleF(80, 118, 120, 30)
  Draw-Pill $g $labelRect ([System.Drawing.ColorTranslator]::FromHtml('#EDE9FE')) $featureLabel $fontLabel ([System.Drawing.ColorTranslator]::FromHtml('#5B3CC4'))

  $g.DrawString($title, $fontTitle, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#111827')), 80, 162)

  $descLines = Wrap-Text $g $desc $fontDesc 400 2
  $descY = 226
  foreach ($line in $descLines) {
    $g.DrawString($line, $fontDesc, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#374151')), 80, $descY)
    $descY += 26
  }

  $bulletY = 320
  $penBullet = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#6B7280'))
  $tagList = @()
  foreach ($t in $tags) { if ($t -and $tagList.Count -lt 3) { $tagList += $t } }
  if ($tagList.Count -eq 0) { $tagList = @('Fast', 'Track', 'Review') }
  foreach ($t in $tagList) {
    $g.DrawString("- $t", $fontTag, $penBullet, 84, $bulletY)
    $bulletY += 26
  }
  $penBullet.Dispose()

  $cardRect = New-Object System.Drawing.RectangleF(420, 110, 820, 560)
  $shadowRect = New-Object System.Drawing.RectangleF(432, 128, 820, 560)
  Draw-RoundedRect $g $shadowRect 34 ([System.Drawing.Color]::FromArgb(22, 22, 16, 48)) $null
  Draw-RoundedRect $g $cardRect 34 ([System.Drawing.Color]::White) ([System.Drawing.ColorTranslator]::FromHtml('#E5E7EB')) 1

  $innerRect = New-Object System.Drawing.RectangleF(438, 128, 784, 524)
  Draw-RoundedRect $g $innerRect 24 ([System.Drawing.ColorTranslator]::FromHtml('#F3F5FF')) $null

  $img = [System.Drawing.Image]::FromFile($imagePath)
  if ($img -is [System.Array]) { $img = $img[0] }
  $clipPath = New-RoundedRectPath $innerRect 22
  $g.SetClip($clipPath)
  Draw-ImageContain $g $img $innerRect
  $g.ResetClip()
  $clipPath.Dispose()
  $img.Dispose()

  $g.DrawString($caption, $fontSmall, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#6B7280')), 438, 690)

  Save-Jpeg $bmp $outPath 92
  $g.Dispose(); $bmp.Dispose()
}

function New-HeroV4($outPath, $brand, $tagline, $subtitle, $desc, $imagePath, $tags) {
  $width = 1400
  $height = 560
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  Draw-SoftBackground $g $width $height

  $fontBrand = New-Object System.Drawing.Font('Microsoft YaHei', 36, [System.Drawing.FontStyle]::Bold)
  $fontTagline = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Bold)
  $fontSub = New-Object System.Drawing.Font('Microsoft YaHei', 18)
  $fontSmall = New-Object System.Drawing.Font('Microsoft YaHei', 14)

  $g.DrawString($brand, $fontBrand, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#111827')), 80, 108)
  $g.DrawString($tagline, $fontTagline, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#5B3CC4')), 80, 158)
  $g.DrawString($subtitle, $fontSub, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#374151')), 80, 208)

  $descLines = Wrap-Text $g $desc $fontSub 520 2
  $descY = 248
  foreach ($line in $descLines) {
    $g.DrawString($line, $fontSub, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4B5563')), 80, $descY)
    $descY += 24
  }

  $pillY = 320
  $pillX = 80
  $pillFont = New-Object System.Drawing.Font('Microsoft YaHei', 12)
  $useTags = @()
  foreach ($t in $tags) { if ($t -and $useTags.Count -lt 3) { $useTags += $t } }
  if ($useTags.Count -eq 0) { $useTags = @('Popup', 'Wordbook', 'Review') }
  foreach ($t in $useTags) {
    $pillRect = New-Object System.Drawing.RectangleF($pillX, $pillY, 110, 28)
    Draw-Pill $g $pillRect ([System.Drawing.ColorTranslator]::FromHtml('#EDE9FE')) $t $pillFont ([System.Drawing.ColorTranslator]::FromHtml('#5B3CC4'))
    $pillX += 118
  }

  $cardRect = New-Object System.Drawing.RectangleF(700, 70, 640, 420)
  $shadowRect = New-Object System.Drawing.RectangleF(712, 88, 640, 420)
  Draw-RoundedRect $g $shadowRect 28 ([System.Drawing.Color]::FromArgb(20, 22, 16, 48)) $null
  Draw-RoundedRect $g $cardRect 28 ([System.Drawing.Color]::White) ([System.Drawing.ColorTranslator]::FromHtml('#E5E7EB')) 1

  $innerRect = New-Object System.Drawing.RectangleF(718, 88, 604, 384)
  Draw-RoundedRect $g $innerRect 22 ([System.Drawing.ColorTranslator]::FromHtml('#F3F5FF')) $null

  $img = [System.Drawing.Image]::FromFile($imagePath)
  if ($img -is [System.Array]) { $img = $img[0] }
  $clipPath = New-RoundedRectPath $innerRect 20
  $g.SetClip($clipPath)
  Draw-ImageContain $g $img $innerRect
  $g.ResetClip()
  $clipPath.Dispose()
  $img.Dispose()

  Save-Jpeg $bmp $outPath 92
  $g.Dispose(); $bmp.Dispose()
}

function New-PromoV4($outPath, $brand, $tagline, $subtitle, $imagePath) {
  $width = 440
  $height = 280
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  Draw-SoftBackground $g $width $height

  $fontBrand = New-Object System.Drawing.Font('Microsoft YaHei', 15, [System.Drawing.FontStyle]::Bold)
  $fontSub = New-Object System.Drawing.Font('Microsoft YaHei', 11)
  $fontTag = New-Object System.Drawing.Font('Microsoft YaHei', 11, [System.Drawing.FontStyle]::Bold)

  $g.DrawString($brand, $fontBrand, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#111827')), 16, 16)
  $g.DrawString($tagline, $fontTag, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#5B3CC4')), 16, 40)
  $g.DrawString($subtitle, $fontSub, [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4B5563')), 16, 60)

  $cardRect = New-Object System.Drawing.RectangleF(16, 90, 408, 172)
  Draw-RoundedRect $g $cardRect 16 ([System.Drawing.Color]::White) ([System.Drawing.ColorTranslator]::FromHtml('#E5E7EB')) 1
  $innerRect = New-Object System.Drawing.RectangleF(24, 98, 392, 156)
  Draw-RoundedRect $g $innerRect 12 ([System.Drawing.ColorTranslator]::FromHtml('#F3F5FF')) $null

  $img = [System.Drawing.Image]::FromFile($imagePath)
  if ($img -is [System.Array]) { $img = $img[0] }
  $clipPath = New-RoundedRectPath $innerRect 10
  $g.SetClip($clipPath)
  Draw-ImageContain $g $img $innerRect
  $g.ResetClip()
  $clipPath.Dispose()
  $img.Dispose()

  Save-Jpeg $bmp $outPath 92
  $g.Dispose(); $bmp.Dispose()
}

$html = Get-Content -Raw -Encoding UTF8 'index.html'
$featureSection = [regex]::Match($html, '(?s)<section id="features".*?</section>').Value
$articles = [regex]::Matches($featureSection, '(?s)<article.*?</article>')
$features = @()
foreach ($article in $articles) {
  $labelMatch = [regex]::Match($article.Value, '<p[^>]*>Feature\\s*\\d+</p>')
  $label = Strip-Tags($labelMatch.Value)
  $title = Strip-Tags([regex]::Match($article.Value, '<h3[^>]*>(.*?)</h3>').Groups[1].Value)
  $desc = Strip-Tags([regex]::Match($article.Value, '<p class=\"mt-3[^\"]*\">(.*?)</p>').Groups[1].Value)
  $caption = Strip-Tags([regex]::Match($article.Value, '<figcaption[^>]*>(.*?)</figcaption>').Groups[1].Value)
  $img = [regex]::Match($article.Value, 'data-feature-src-light=\"([^\"]+)\"').Groups[1].Value

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

$outDir = Join-Path (Get-Location) 'screens/feature-cards/v4'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

for ($i = 0; $i -lt 5; $i++) {
  $f = $features[$i]
  $imgPath = [string](Resolve-ImagePath $f.Image)
  $out = Join-Path $outDir ("feature-0{0}-1280x800.jpg" -f ($i + 1))
  New-FeatureCardV4 $out $f.Label $f.Title $f.Desc $f.Tags $imgPath $f.Caption
}

$heroSection = [regex]::Match($html, '(?s)<section id="top".*?</section>').Value
$brandRaw = [regex]::Match($heroSection, '<span class=\"block text-slate-900[^\"]*\">([\\s\\S]*?)</span>').Groups[1].Value
$brand = Strip-Tags($brandRaw)
$tagline = Strip-Tags([regex]::Match($heroSection, '<span class=\"mt-3 block bg-gradient-to-r[^\"]*\">(.*?)</span>').Groups[1].Value)
$subtitle = Strip-Tags([regex]::Match($heroSection, '<span class=\"mt-3 block text-xl[^\"]*\">(.*?)</span>').Groups[1].Value)
$heroDescRaw = Strip-Tags([regex]::Match($heroSection, '<p class=\"mt-6 text-lg[^\"]*\">(.*?)</p>').Groups[1].Value)

$heroImage = [string](Resolve-ImagePath $features[1].Image)
$promoImage = [string](Resolve-ImagePath $features[0].Image)
$heroTags = $features[0].Tags

New-HeroV4 (Join-Path $outDir 'hero-1400x560.jpg') $brand $tagline $subtitle $heroDescRaw $heroImage $heroTags
New-PromoV4 (Join-Path $outDir 'promo-440x280.jpg') $brand $tagline $subtitle $promoImage
