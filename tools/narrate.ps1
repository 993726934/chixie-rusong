$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft Huihui Desktop')
$speaker.Rate = -1
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
$items = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'narration.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$root = Split-Path $PSScriptRoot
foreach ($item in $items) {
 $path = Join-Path $root $item.file
 $speaker.SetOutputToWaveFile($path, $format)
 $speaker.Speak($item.text)
 $speaker.SetOutputToNull()
 Write-Output $item.file
}
$speaker.Dispose()
