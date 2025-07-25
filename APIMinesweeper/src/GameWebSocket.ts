
import { WebSocketServer, WebSocket } from "ws";
import http from 'http';

import Client from "./Client.js";
import Utilisateur from "./model/Utilisateur.js";
import UtilisateurAnonyme from "./model/UtilisateurAnonyme.js";



export default class GameWebSocket {

    constructor(server: any) {


        const wsServer = new WebSocketServer({
            server: server
        });

        wsServer.on('connection', (socket: WebSocket) => {
            console.log("connection")
            new Client(socket)
        })

        //Utilisateur.Utilisateurs = {0:new UtilisateurAnonyme(),1:new UtilisateurAnonyme()};

    }
}






