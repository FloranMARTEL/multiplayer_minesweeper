

import Utilisateur from "./model/Utilisateur.js";
import GameRoom from "./GameRoom.js";

import { WebSocketServer, WebSocket } from "ws";
import { util } from "undici";
import { timeLog } from "console";


export default class Client {
    socket: WebSocket
    utilisateur : Utilisateur | null
    gameRoom: GameRoom | null

    constructor(socket: WebSocket) {
        this.socket = socket
        this.gameRoom = null
        this.utilisateur = null

        this.socket.on("message", (data: String | Buffer) => {

            const message = JSON.parse(data.toString());

            if (message.type === "CreateGame") {
                this.createGame(message)
            }
            else if (message.type === "JoinGame"){
                this.joinGame(message)
            }
            else if (message.type === "StartGame"){
                this.startGame()
            }
            else if (message.type === "ShowCell") {
                this.showTile(message)

            } else if (message.type === "Flag") {
                this.flag(message)
            }

        })



    }

    createGame(message: any) {
        const utilisateur = Utilisateur.GetUser(message.token)
        if (utilisateur == null){
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "aucun utilisateur ne corespond à ce token"
            }))
            return
        }
        this.utilisateur = utilisateur


        const roomSize = message.roomSize
        const height = message.height
        const width = message.width
        const nbBomb = message.nbBomb
        this.gameRoom = new GameRoom(this,roomSize,height,width,nbBomb)


        this.socket.send(JSON.stringify({
            type: "CreateGame",
            roomId: this.gameRoom.getRoomID(),
            height: this.gameRoom.getHeight(),
            width: this.gameRoom.getWidth(),
            nbBomb: this.gameRoom.getNbBomb(),
            roomSize: this.gameRoom.getRoomSize(),
            hostId : this.utilisateur.id,
        }))
    }

    joinGame(message:any) {
        const utilisateur = Utilisateur.GetUser(message.token)
        if (utilisateur == null){
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "aucun utilisateur ne corespond à ce token"
            }))
            return
        }
        this.utilisateur = utilisateur

        const roomId = message.roomId

        const gameroom = GameRoom.GetGameRoom(roomId);
        if (gameroom === null){
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "cette partie n'existe pas"
            }))
            return
        }
        this.gameRoom = gameroom

        this.gameRoom.joinGameRoom(this) //check si la parti est plenne
        
    }

    startGame(){
        if (this.gameRoom && this.gameRoom.isHost(this)){
            this.gameRoom.startGame();
        }else{
            console.log("ERREUR")
        }

    }

    showTile(message: any) {

        if (this.gameRoom === null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas dans une partie"
            }))
            return
        }

        if (this.utilisateur === null){
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas identifier"
            }))
            return
        }

        ////

        const row = message.row
        const col = message.col
        this.gameRoom.discoverTile(this.utilisateur,row, col)

    }

    flag(message: any) {
        if (!this.gameRoom || this.utilisateur === null){
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas dans une partie"
            }))
            return
        }

        const action = message.action
        const row = message.row
        const col = message.col

        if (action === "set") {
            this.gameRoom.setFlag(this.utilisateur,row,col)
        } else if (action === "remouve") {
            this.gameRoom.remouveFlag(this.utilisateur,row,col)
        }
    }
}