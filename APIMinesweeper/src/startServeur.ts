console.log("Server Start")

const PORT = 5000

// import express, { Request, Response } from 'express';
// let app = express();

// app.use('/api', require('./root.js'));

// app.listen(PORT);

import { WebSocketServer,WebSocket } from "ws";

import http from 'http';

const server = http.createServer();
server.listen(PORT)

const wsServer = new WebSocketServer({
  server : server
});


const clients : WebSocket[] = [];

wsServer.on('connection', (socket : WebSocket)=>{

  console.log("connection")
  clients.push(socket)

  socket.on("message", (data : String | Buffer)=>{

    console.log(data.toString())

    clients.forEach((cli : WebSocket)=>{
      cli.send("bonjour");
    })

  })
})