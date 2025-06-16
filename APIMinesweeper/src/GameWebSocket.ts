
import { WebSocketServer, WebSocket } from "ws";
import http from 'http';

import Client from "./Client.js";



export default class GameWebSocket {

    constructor(server: any) {


        const wsServer = new WebSocketServer({
            server: server
        });

        wsServer.on('connection', (socket: WebSocket) => {
            console.log("connection")
            new Client(socket)

        })
    }
}






