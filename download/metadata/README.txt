gc ..\id.txt | % { youtube-dl -j "https://www.youtube.com/watch?v=$_" >"$_.json" }
