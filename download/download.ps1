<#
  List videos: youtube-dl -v -s --get-id --flat-playlist "https://www.youtube.com/user/yuttadhammo"
  Split in groups: $gsize = 400; $i = 0; gc C:\src\gh\al\download\ids.txt | % { $_ >> "g$([math]::Floor($i++ / $gsize)).txt" }

  youtube-dl -f 'bestaudio[ext=m4a]' -o '%(id)s.%(ext)s' 'http://youtu.be/<id>'

  ffmpeg -i filename.mp4 filename.mp3

  Copy file: azcopy copy <source> https://almedia.blob.core.windows.net/audio<saskey>

  Download azcopy: https://aka.ms/downloadazcopy-v10-windows
#>

param(
  $ids
)

$root = $PSScriptRoot
$azcopy = Join-Path $PSScriptRoot "azcopy_windows_amd64_10.4.3\azcopy.exe"

Get-Content $ids | ForEach-Object {
  $id = $_
  Write-Output "=============================== Starting $id ==============================="
  youtube-dl.exe -f 'bestaudio[ext=m4a]' -o '%(id)s.%(ext)s' "http://youtu.be/$id"
  Get-ChildItem "$id.m4a"
  ffmpeg.exe -i "$id.m4a" "$id.mp3"
  Get-ChildItem "$id.mp3"
  & $azcopy copy "$id.mp3" 'https://almedia.blob.core.windows.net/audio?<key>'
  Write-Output "=============================== Done with $id ==============================="
}

# dir | sort -Property Name | % { "{0},{1}" -f $_.FullName,$_.Length } >..\g4.files.txt

# gc .\id.txt | % { youtube-dl -j "https://www.youtube.com/watch?v=$_" >"$_.json" }
