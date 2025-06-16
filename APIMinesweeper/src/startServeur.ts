
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

import GameWebSocket from "./GameWebSocket.js";
import { setGlobalOrigin } from "undici";



const server = http.createServer();
server.listen(PORT,()=>{
  console.log("Server Start")
})

const wsGameServeur = new GameWebSocket(server)
