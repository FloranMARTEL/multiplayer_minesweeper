console.log("Server Start")

import Game from "./MineswepperModel/Game.js"

const PORT = 5000

// import express, { Request, Response } from 'express';
// let app = express();

// app.use('/api', require('./root.js'));

// app.listen(PORT);

import { WebSocketServer,WebSocket } from "ws";

import http from 'http';
import { v4 as uuidv4 } from 'uuid';


const server = http.createServer();
server.listen(PORT)

const wsServer = new WebSocketServer({
  server : server
});


const clients : WebSocket[] = [];

const gamelist : { [key: string]: Game }= {}

wsServer.on('connection', (socket : WebSocket)=>{

  console.log("connection")
  clients.push(socket)

  const id = uuidv4()

  socket.on("message", (data : String | Buffer)=>{

    const message = JSON.parse(data.toString());
    console.log(" <-- message" )
    if (message.type == "CreateGame"){

      console.log(
        "nbBomb : "+message.nbBomb
      )

      const game = new Game(null,message.height,message.width,message.nbBomb)

      gamelist[id] = game

      console.log(
        "nbBomb : "+game.board.nbBomb
      )
      
      socket.send(JSON.stringify({
        type : "CreateGame",
        height : game.board.height,
        width : game.board.width,
        nbBomb : game.board.nbBomb
      }))

    }

  })
})
