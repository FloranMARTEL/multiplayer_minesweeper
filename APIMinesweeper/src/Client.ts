
import Game from "./MineswepperModel/Game.js"
import { GameStatus } from "./MineswepperModel/Game.js"


import { WebSocketServer, WebSocket } from "ws";


export default class Client {
    socket: WebSocket
    id : number | null
    game: Game | null

    constructor(socket: WebSocket) {
        this.socket = socket
        this.game = null
        this.id = null

        this.socket.on("message", (data: String | Buffer) => {

            const message = JSON.parse(data.toString());

            if (message.type === "CreateGame") {
                this.createGame(message)
            }
            else if (message.type === "ShowCell") {
                this.showTile(message)

            } else if (message.type === "Flag") {
                this.flag(message)
            }

        })



    }

    createGame(message: any) {
        const game = new Game(null, message.height, message.width, message.nbBomb, 2)
        this.game = game
        this.id = message.id

        this.socket.send(JSON.stringify({
            type: "CreateGame",
            id: game.getid(),
            height: game.getheight(),
            width: game.getwidth(),
            nbBomb: game.getnbBomb()
        }))
    }

    joinGame(message:any) {
        this.id = message.id

        //TODO
    }

    showTile(message: any) {

        if (!this.game) {
            this.socket.send(JSON.stringify({
                type: "erreur",
                message: "vous n'êtes pas dans une partie"
            }))
            return
        }

        const row = message.row
        const col = message.col
        const tiles = this.game.discoverTileWithRowAndCol(row, col)

        if (this.game.getGameStatus() === GameStatus.Over) {
            this.socket.send(JSON.stringify({
                type: "GameOver"
            }))
            this.socket.close()
        }
        else {
            const tilesmaped = Object.fromEntries(
                Object.entries(tiles).map(([k, t]) => [k, t.getValue()])
            );

            this.socket.send(JSON.stringify({
                type: "ShowCell",
                tiles: tilesmaped,
                gamestatus: this.game.getGameStatus()
            }))
        }
    }

    flag(message: any) {
        if (!this.game || this.id === null){
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
            this.game.placeFlagWithRowAndCol(row, col,this.id)
            this.socket.send(JSON.stringify({
                type: "Flag",
                action: "set",
                row: row,
                col: col
            }))
        } else if (action === "remouve") {
            this.game.RemouveFlagWithRowAndCol(row, col,this.id)
            this.socket.send(JSON.stringify({
                type: "Flag",
                action: "remouve",
                row: row,
                col: col
            }))
        }
    }



}