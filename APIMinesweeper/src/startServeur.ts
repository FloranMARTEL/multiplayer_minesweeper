console.log("Server Start")

const PORT = 5000

// import express, { Request, Response } from 'express';
// let app = express();

// app.use('/api', require('./root.js'));

// app.listen(PORT);


const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(PORT)


const wsServer = new webSocketServer({
  httpServer: server
});


const clients = [];

wsServer.on('request', (request : any)=>{

    console.log('org', request.origin + '.')

    clients.push(request.accept(null,request.origin))
})

wsServer.on('message',( message : any) =>{
    console.log(message.utf8Data);
})