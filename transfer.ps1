
$AbsolutPathApikey = "C:\Users\Floran\Downloads\cle_demineur_2.pem"

$pathFrontend = "./minesweeper"
$pathBackend = "./APIMinesweeper"

$username = "ubuntu"
$ipserv = "13.48.124.224"

Push-Location $pathFrontend
npm run build

scp -i $AbsolutPathApikey -r build ${username}@${ipserv}:/home/ubuntu/test/

Pop-Location

Push-Location $pathBackend
npx tsc
scp -i $AbsolutPathApikey -r dist ${username}@${ipserv}:/home/ubuntu/APIMinesweeper/

Pop-Location


# Start-Process -FilePath "git" -ArgumentList "status" -WorkingDirectory "C:\chemin\du\projet" -NoNewWindow -Wait