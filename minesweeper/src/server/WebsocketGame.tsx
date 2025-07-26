import TokenManager from "./TokenManager";

import {GameManager} from "../pages/GameManager";

export default class WebsocketGame {

    client: WebSocket

    //if roomID = null send create game
    constructor(roomId : number | null, gameManager : GameManager) {
        this.client = new WebSocket('ws://localhost:5000');

        this.client.onopen = () => {

            if (roomId === null){
                this.sendCreateGame()
            }else{
                this.sendJoinGame(roomId)
            }
        }

        this.client.onmessage = (event: MessageEvent) => {
            const jsonmessage = JSON.parse(event.data.toString());
            console.log(jsonmessage)
            if (jsonmessage.type === "CreateGame") {
                gameManager.setGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb, jsonmessage.roomId,jsonmessage.roomSize)
                gameManager.addPlayer(jsonmessage.hostId)

            }else if (jsonmessage.type === "JoinGame") {
                gameManager.setGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb, jsonmessage.roomId,jsonmessage.roomSize)
                
                //set player list
                const playersId = jsonmessage.playersId as number[];
                gameManager.setPlayersList(playersId)
                
            }else if (jsonmessage.type === "NewPlayer"){
                const playerId = jsonmessage.playerId as number
                gameManager.addPlayer(playerId)

            }else if (jsonmessage.type === "UpdateStateGame"){
                gameManager.updateGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb,jsonmessage.roomSize)
            }
            
            else if (jsonmessage.type === "StartGame"){
                gameManager.initGameBoard(jsonmessage.timestemp)
            
            }else if (jsonmessage.type === "ShowCell") {
                // updateTile
                const tiles = jsonmessage.tiles as { [key: number]: number }
                gameManager.updateTiles(tiles)

                //update compteur tiles
                const nbTiles = jsonmessage.nbTiles as number
                const userid = jsonmessage.user as number
                gameManager.addCptTiles(userid,nbTiles)

                //check status Parti
                console.log(jsonmessage.gameStatus === 2)
                if (jsonmessage.gameStatus === 2){
                    gameManager.gameDone()
                }
            }
            else if (jsonmessage.type === "Flag") {
                const action = jsonmessage.action
                const row = jsonmessage.row
                const col = jsonmessage.col
                if (action === "set") {
                    gameManager.setFlag(row, col)
                } else if (action === "remouve") {
                    gameManager.remouveFlag(row, col)
                }
                this.client.onclose = () => {
                    console.log("connection closed")
                }
            }
            else if(jsonmessage.type === "GameOver"){
                gameManager.gameOver(jsonmessage.row,jsonmessage.col)
            }else if (jsonmessage.type === "DeleteGame"){
                this.client.close()
                gameManager.leaveGame()
            }else if (jsonmessage.type === "LeaveGame"){
                gameManager.remouvePlayer(jsonmessage.userId)
            }

        }

    }

    private async sendCreateGame() {
        this.client.send(JSON.stringify({
            type: "CreateGame",
            width: 10,
            height: 10,
            nbBomb: 10,
            roomSize : 10,
            token: await TokenManager.GetToken()
        }))
    }
    

    private async sendJoinGame(roomID : number){
        this.client.send(JSON.stringify({
            type: "JoinGame",
            roomId : roomID,
            token: await TokenManager.GetToken()
        }))
    }

    sendUpdateStateGame(height : number, width : number, nbBomb : number, roomSize : number){
        this.client.send(JSON.stringify({
            type : "UpdateStateGame",
            width: width,
            height: height,
            nbBomb: nbBomb,
            roomSize : roomSize,
        }))
    }
    


    sendDiscoverTile(r: number, c: number) {
        this.client.send(JSON.stringify({
            type: "ShowCell",
            row: r,
            col: c
        }))
    }

    sendSetFlag(r: number, c: number) {
        this.client.send(JSON.stringify({
            type: "Flag",
            action: "set",
            row: r,
            col: c
        }))
    }

    sendRemouveFlag(r: number, c: number) {
        this.client.send(JSON.stringify({
            type: "Flag",
            action: "remouve",
            row: r,
            col: c
        }))
    }

    sendStartGame(){
        this.client.send(JSON.stringify({
            type:"StartGame"
        }))
    }

    sendLeaveGame(){
        this.client.send(JSON.stringify({
            type:"LeaveGame",
        }))
    }


}