console.log("Server Start")

import Game from "./MineswepperModel/Game.js"
import { GameStatus } from "./MineswepperModel/Game.js"

const PORT = 5000

// import express, { Request, Response } from 'express';
// let app = express();

// app.use('/api', require('./root.js'));

// app.listen(PORT);

import { WebSocketServer, WebSocket } from "ws";

import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { json } from "stream/consumers";


const server = http.createServer();
server.listen(PORT)

const wsServer = new WebSocketServer({
  server: server
});


const clients: WebSocket[] = [];

const gamelist: { [key: string]: Game } = {}

wsServer.on('connection', (socket: WebSocket) => {

  console.log("connection")
  clients.push(socket)

  const id = uuidv4()

  socket.on("message", (data: String | Buffer) => {

    const message = JSON.parse(data.toString());
    console.log(" <-- message")
    if (message.type === "CreateGame") {

      const game = new Game(null, message.height, message.width, message.nbBomb)

      gamelist[id] = game


      socket.send(JSON.stringify({
        type: "CreateGame",
        height: game.getheight(),
        width: game.getwidth(),
        nbBomb: game.getnbBomb()
      }))
    }

    else if (message.type === "ShowCell") {

      const row = message.row
      const col = message.col

      const game = gamelist[id];
      const tiles = game.discoverTileWithRowAndCol(row, col)

      //
      if (game.getGameStatus() === GameStatus.Over) {
        socket.send(JSON.stringify({
          type: "GameOver"
        }))
        socket.close()
      }
      else {
        const tilesmaped = Object.fromEntries(
          Object.entries(tiles).map(([k, t]) => [k, t.getValue()])
        );

        socket.send(JSON.stringify({
          type: "ShowCell",
          tiles: tilesmaped,
          gamestatus: game.getGameStatus()
        }))
      }





    } else if (message.type === "Flag") {

      const game = gamelist[id];

      const action = message.action
      const row = message.row
      const col = message.col


      if (action === "set") {
        game.placeFlagWithRowAndCol(row, col)
        socket.send(JSON.stringify({
          type: "Flag",
          action: "set",
          row: row,
          col: col
        }))
      } else if (action === "remouve") {
        game.RemouveFlagWithRowAndCol(row, col)
        socket.send(JSON.stringify({
          type: "Flag",
          action: "remouve",
          row: row,
          col: col
        }))
      }
    }

  })
})
