
import cors from 'cors';
const PORT = 5000

import express, { Request, Response } from 'express';
import router from './root.js';
let app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', router);

import http from 'http';
import GameWebSocket from "./GameWebSocket.js";



const server = http.createServer(app);
server.listen(PORT,()=>{
  console.log(`Server Start localhost:${PORT}`)
})

const wsGameServeur = new GameWebSocket(server)
