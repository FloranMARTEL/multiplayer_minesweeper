

export default class WebsocketGame {

    client: WebSocket

    //if roomID = null send create game
    constructor(roomId : number | null,
        setGameStatus: (height: number, width: number, nbBomb: number, roomId: number, roomSize : number) => void,
        updateTiles: (tiles: { [key: number]: number }) => void,
        setflag: (row: number, col: number) => void,
        remouveflag: (row: number, col: number) => void
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

            }else if (jsonmessage.type === "JoinGame") {
                setGameStatus(jsonmessage.height, jsonmessage.width, jsonmessage.nbBomb, jsonmessage.roomId,jsonmessage.roomSize)
            }else if (jsonmessage.type === "ShowCell") {
                const tiles = jsonmessage.tiles as { [key: number]: number }
                updateTiles(tiles)

            }
            else if (jsonmessage.type === "Flag") {
                const action = jsonmessage.action
                const row = jsonmessage.row
                const col = jsonmessage.col
                if (action === "set") {
                    setflag(row, col)
                } else if (action === "remouve") {
                    remouveflag(row, col)
                }
                this.client.onclose = () => {
                    console.log("connection closed")
                }
            }

        }

    }

    private sendCreateGame() {
        this.client.send(JSON.stringify({
            type: "CreateGame",
            width: 10,
            height: 10,
            nbBomb: 10,
            gameSize : 2,
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


}