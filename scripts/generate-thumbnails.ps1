Add-Type -AssemblyName System.Drawing
$sourceFolders = @('projects', 'certificates', 'public')
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
foreach ($folder in $sourceFolders) {
  Get-ChildItem -LiteralPath $folder -File | Where-Object { $_.Extension -in '.png','.jpg','.jpeg' -and $_.Name -ne 'profile.png' } | ForEach-Object {
    $source = [System.Drawing.Image]::FromFile($_.FullName)
    $limit = if ($folder -eq 'certificates') { 1000 } else { 480 }
    $width = [Math]::Min($limit, $source.Width)
    $height = [Math]::Max(1, [int]($source.Height * $width / $source.Width))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($source, 0, 0, $width, $height)
    $destination = Join-Path (Resolve-Path 'public/thumbnails') ($_.Name + '.jpg')
    $bitmap.Save($destination, $codec, $params)
    $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
  }
}
$params.Dispose()
