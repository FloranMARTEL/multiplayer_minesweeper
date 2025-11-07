

import Utilisateur from "./model/Utilisateur.js";
import GameRoom from "./GameRoom.js";

import { WebSocketServer, WebSocket } from "ws";


export default class Client {

    private static USERIdToGameRoomId : { [key: number]: number } = {}

    socket: WebSocket
    utilisateur: Utilisateur | null
    gameRoom: GameRoom | null

    constructor(socket: WebSocket) {
        this.socket = socket
        this.gameRoom = null
        this.utilisateur = null

        this.socket.on("message", (data: String | Buffer) => {

            const message = JSON.parse(data.toString());
            console.log(message)
            if (message.type === "CreateGame") {
                this.createGame(message)
            }
            else if (message.type === "JoinGame") {
                this.joinGame(message)
            } else if (message.type === "UpdateStateGame") {
                this.updateStateGame(message)
            }
            else if (message.type === "StartGame") {
                this.startGame()
            }
            else if (message.type === "ShowCell") {
                this.showTile(message)

            } else if (message.type === "Flag") {
                this.flag(message)
            } else if (message.type === "LeaveGame") {
                this.leaveGame(message)
            }

        })

        this.socket.on('close', (code, reason) => {
            console.log(`Client déconnecté (code: ${code}, raison: ${reason.toString()})`);
        });
    }

    createGame(message: any) {
        const token = message.token
        const utilisateur = Utilisateur.GetUser(token)
        if (utilisateur == null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "aucun utilisateur ne corespond à ce token"
            }))
            return
        }
        this.utilisateur = utilisateur
        const gameRoomID = Client.USERIdToGameRoomId[utilisateur.id]
        this.gameRoom = GameRoom.GetGameRoom(gameRoomID)

        console.log("----------------")
        console.log(this.gameRoom)
        console.log(this.gameRoom?.getRoomID)
        console.log("----------------")
        if (this.gameRoom) {
            this.socket.send(JSON.stringify({
                type: "CreateGame",
                roomId: this.gameRoom.getRoomID(),
                height: this.gameRoom.getHeight(),
                width: this.gameRoom.getWidth(),
                nbBomb: this.gameRoom.getNbBomb(),
                roomSize: this.gameRoom.getRoomSize(),
                playersId: this.gameRoom.getAllPlayersID(),
                hostId: this.utilisateur.id,
            }))
            return;
        }


        const roomSize = message.roomSize
        const height = message.height
        const width = message.width
        const nbBomb = message.nbBomb

        const gameRoom = new GameRoom(this, roomSize, height, width, nbBomb)
        Client.USERIdToGameRoomId[utilisateur.id] = gameRoom.getRoomID()
        this.gameRoom = gameRoom

        this.socket.send(JSON.stringify({
            type: "CreateGame",
            roomId: this.gameRoom.getRoomID(),
            height: this.gameRoom.getHeight(),
            width: this.gameRoom.getWidth(),
            nbBomb: this.gameRoom.getNbBomb(),
            roomSize: this.gameRoom.getRoomSize(),
            playersId : [this.utilisateur.id],
            hostId: this.utilisateur.id,
        }))
    }

    joinGame(message: any) {
        const token = message.token
        const utilisateur = Utilisateur.GetUser(token)
        if (utilisateur == null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "aucun utilisateur ne corespond à ce token"
            }))
            return
        }
        this.utilisateur = utilisateur
        const oldGameRoomID = Client.USERIdToGameRoomId[utilisateur.id]
        const oldGameRoom = GameRoom.GetGameRoom(oldGameRoomID)
        if (oldGameRoom !== null){
            oldGameRoom.leaveGameRoom(this)
        }
        
        const roomId = message.roomId
        const gameroom = GameRoom.GetGameRoom(roomId);
        if (gameroom === null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "cette partie n'existe pas"
            }))
            return
        }
        Client.USERIdToGameRoomId[utilisateur.id] = gameroom.getRoomID()
        this.gameRoom = gameroom

        this.gameRoom.joinGameRoom(this) //check si la parti est plenne

    }

    updateStateGame(message: any) {
        if (this.gameRoom && this.gameRoom.isHost(this)) {
            this.gameRoom.updateStateGame(message.height, message.width, message.nbBomb, message.roomSize)
        }
    }

    startGame() {
        if (this.gameRoom && this.gameRoom.isHost(this)) {
            this.gameRoom.startGame();
        } else {
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

        if (this.utilisateur === null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas identifier"
            }))
            return
        }

        ////

        const row = message.row
        const col = message.col
        this.gameRoom.discoverTile(this.utilisateur, row, col)

    }

    flag(message: any) {
        if (!this.gameRoom || this.utilisateur === null) {
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
            this.gameRoom.setFlag(this.utilisateur, row, col)
        } else if (action === "remouve") {
            this.gameRoom.remouveFlag(this.utilisateur, row, col)
        }
    }

    leaveGame(message: any) {
        if (!this.gameRoom || this.utilisateur === null) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas dans une partie"
            }))
            return
        }

        if (this.gameRoom.isHost(this)) {
            this.gameRoom.deleteGameRoom()
        } else {
            this.gameRoom.leaveGameRoom(this)
        }
        
    }

    public static LeaveGame(id : number) {
        delete Client.USERIdToGameRoomId[id]
    }
}