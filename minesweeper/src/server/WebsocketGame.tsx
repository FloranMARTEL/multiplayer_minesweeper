import { NumericLiteral } from "typescript";
import ApiMinesweeper from "./ApiMinesweeper";

export default class WebsocketGame {

    client: WebSocket

    //if roomID = null send create game
    constructor(roomId : number | null,
        setGameStatus: (height: number, width: number, nbBomb: number, roomId: number, roomSize : number) => void,
        updateGameStatus: (height: number, width: number, nbBomb: number, roomSize : number) => void,
        updateTiles: (tiles: { [key: number]: number }) => void,
        addCptTiles: (userId : number, nbTiles : number) => void,
        setFlag: (row: number, col: number) => void,
        remouveFlag: (row: number, col: number) => void,
        setPlayersList: ( players : { [key : number]: { name: string, flag: string }} ) => void,
        addPlayer: (playerId : number, player: { name: string; flag: string; }) => void,
        initGameBoard: () => void,
        gameOver: (row : number, col : number) => void
    ) {
        console.log("creaction websocket")
        this.client = new WebSocket('ws://localhost:5000');

        this.client.onopen = () => {
            console.log("Client connected");

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
                setGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb, jsonmessage.roomId,jsonmessage.roomSize)
                
                ApiMinesweeper.GetPlayerResumByID(jsonmessage.hostId)
                .then((player)=>{
                    addPlayer(jsonmessage.hostId,player)
                })

            }else if (jsonmessage.type === "JoinGame") {
                setGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb, jsonmessage.roomId,jsonmessage.roomSize)
                
                //set player list
                const playersId = jsonmessage.playersId as number[];
                let players : { [key : number]: { name: string, flag: string }} = {}

                Promise.all(playersId.map(async (playerId : number) => {
                    const player = await ApiMinesweeper.GetPlayerResumByID(playerId)
                    players[playerId] = player
                })).then(()=>{
                    setPlayersList(players)
                })
                
            }else if (jsonmessage.type === "NewPlayer"){
                const playerId = jsonmessage.playerId as number
                ApiMinesweeper.GetPlayerResumByID(playerId)
                .then((player)=>{
                    addPlayer(playerId,player)
                })

            }else if (jsonmessage.type === "UpdateStateGame"){
                updateGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb,jsonmessage.roomSize)
            }
            
            else if (jsonmessage.type === "StartGame"){
                initGameBoard()
            
            }else if (jsonmessage.type === "ShowCell") {
                // updateTile
                const tiles = jsonmessage.tiles as { [key: number]: number }
                updateTiles(tiles)

                //update compteur tiles
                const nbTiles = jsonmessage.nbTiles as number
                const userid = jsonmessage.user as number
                addCptTiles(userid,nbTiles)
            }
            else if (jsonmessage.type === "Flag") {
                const action = jsonmessage.action
                const row = jsonmessage.row
                const col = jsonmessage.col
                if (action === "set") {
                    setFlag(row, col)
                } else if (action === "remouve") {
                    remouveFlag(row, col)
                }
                this.client.onclose = () => {
                    console.log("connection closed")
                }
            }
            else if(jsonmessage.type === "GameOver"){
                gameOver(jsonmessage.row,jsonmessage.col)
            }

        }

    }

    private sendCreateGame() {
        this.client.send(JSON.stringify({
            type: "CreateGame",
            width: 10,
            height: 10,
            nbBomb: 10,
            roomSize : 10,
            token: 0
        }))
    }
    

    private sendJoinGame(roomID : number){
        this.client.send(JSON.stringify({
            type: "JoinGame",
            roomId : roomID,
            token: 1
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


}