# multiplayer_minesweeper

npx create-react-app mon-app --template typescript


npm i -g serve
npm i -g pm2

pm2 start serve -s build

pm2 list

pm2 dealet <ID>


//relancer automatiquement avec le serveur
pm2 unstartup
pm2 save
//

//

pm2 start serve --name "minesweeper" -- -s build

//
