import Client from "./Client.js"
import Game from "./MineswepperModel/Game.js"
import { GameStatus } from "./MineswepperModel/Game.js"
import Utilisateur from "./model/Utilisateur.js"

export default class GameRoom {


    private static CptID: number = 0
    private static GameRooms: { [key: number]: GameRoom } = {}


    private roomID: number
    private roomSize: number
    private players: Set<Client> //Client[]
    private game: Game | null
    private host: Utilisateur

    private gameHeight: number
    private gameWidth: number
    private gameNbBomb: number


    constructor(host: Client, roomSize: number, gameHeight: number, gameWidth: number, gameNbBomb: number) {

        if (host.utilisateur == null) {
            throw new Error("le host n'est pas connecter à utilisateur")
        }

        this.roomID = ++GameRoom.CptID
        this.roomSize = roomSize
        this.players = new Set([host])
        this.game = null
        this.host = host.utilisateur

        this.gameHeight = gameHeight
        this.gameWidth = gameWidth
        this.gameNbBomb = gameNbBomb

        GameRoom.AddGameRoom(this)
    }

    joinGameRoom(cli: Client): boolean {
        if (this.players.size >= this.roomSize) {
            return false
        }

        this.sendtoallplayer({
            type: "NewPlayer",
            playerId: cli.utilisateur?.id
        })

        this.players.add(cli)

        console.log("-------- xx -----")
        console.log(cli.utilisateur)
        console.log("-------- xx -----")

        cli.socket.send(JSON.stringify({
            type: "JoinGame",
            roomId: this.getRoomID(),
            height: this.getHeight(),
            width: this.getWidth(),
            nbBomb: this.getNbBomb(),
            roomSize: this.getRoomSize(),
            host: this.getHostID(),
            playersId: this.getAllPlayersID()
        }))
        console.log("--------xxx -----")


        return true
    }

    leaveGameRoom(client: Client) {
        this.players.delete(client)
        this.sendtoallplayer({
            type: "LeaveGame",
            userId: client.utilisateur!.id
        })
        Client.LeaveGame(client.utilisateur!.id)

    }

    startGame(): boolean {
        // if (this.players.length !== this.roomSize) {
        //     return false
        // }

        const idplayers = this.getAllPlayersID()

        const timestemp = Date.now()


        this.game = new Game(null, this.gameHeight, this.gameWidth, this.gameNbBomb, idplayers, timestemp)

        this.sendtoallplayer({
            type: "StartGame",
            timestemp: timestemp
        })

        return true
    }

    isHost(host: Utilisateur) {
        return (host.id == this.host.id)
    }

    getAllPlayersID(): number[] {
        const idplayers = [...(this.players)].map((cli) => {
            return cli.utilisateur?.id
        }) as number[];

        return idplayers
    }

    updateStateGame(height: number, width: number, nbBomb: number, roomSize: number) {
        this.gameHeight = height
        this.gameWidth = width
        this.gameNbBomb = nbBomb
        this.roomSize = roomSize

        this.sendtoallplayer({
            type: "UpdateStateGame",
            height: this.getHeight(),
            width: this.getWidth(),
            nbBomb: this.getNbBomb(),
            roomSize: this.getRoomSize()
        })
    }

    updatePlayerClient(client: Client) {
        if (client.utilisateur == null) {
            throw new Error("client.utilisateur est null");
        }

        for (const player of this.players) {
            if (client.utilisateur.id == player.utilisateur!.id) {

                this.players.delete(player);
                this.players.add(client);
                break;
            }
        }
    }

    ///

    discoverTile(user: Utilisateur, row: number, col: number) {

        if (this.game == null) {
            //erreur
            return
        }

        const { tiles, nbTiles } = this.game.discoverTileWithRowAndCol(row, col, user.id)

        if (this.game.getGameStatus() === GameStatus.Lost) {

            this.sendtoallplayer({
                type: "GameOver",
                user: user.id,
                row: row,
                col: col
            })
            //provisoire
            this.players.forEach((player) => {
                Client.LeaveGame(player.utilisateur!.id);
            })
            this.closeConnection()
            GameRoom.DeleteGameRoom(this)
            //
        }
        else {
            const tilesmaped: { [key: number]: number } = {}
            for (const key in tiles) {
                tilesmaped[key] = tiles[key].getValue()
            }

            this.sendtoallplayer({
                type: "ShowCell",
                tiles: tilesmaped,
                nbTiles: nbTiles,
                user: user.id,
                gameStatus: this.game.getGameStatus()
            })

            if (this.game.getGameStatus() == GameStatus.Win) {
                //provisoire
                this.players.forEach((player) => {
                    Client.LeaveGame(player.utilisateur!.id);
                })
                this.closeConnection()
                GameRoom.DeleteGameRoom(this)
                //
            }
        }
    }


    setFlag(user: Utilisateur, row: number, col: number) {
        if (this.game == null) {
            //erreur
            return
        }


        this.game.placeFlagWithRowAndCol(row, col, user.id)

        this.sendtoallplayer({
            type: "Flag",
            action: "set",
            user: user.id,
            row: row,
            col: col
        })
    }


    remouveFlag(user: Utilisateur, row: number, col: number) {

        if (this.game == null) {
            //erreur
            return
        }

        this.game.RemouveFlagWithRowAndCol(row, col, user.id)
        this.sendtoallplayer({
            type: "Flag",
            action: "remouve",
            user: user.id,
            row: row,
            col: col
        })
    }

    deleteGameRoom() {
        this.sendtoallplayer({
            type: "DeleteGame"
        })
        GameRoom.DeleteGameRoom(this)
        this.closeConnection()
    }
    ///


    sendtoallplayer(message: any) {
        this.players.forEach((player: Client) => {
            player.socket.send(JSON.stringify(message))
        })
    }

    closeConnection() {
        this.players.forEach((player: Client) => {
            player.socket.close()
        })
    }

    getRoomID() {
        return this.roomID
    }
    getHeight() {
        return this.gameHeight
    }
    getWidth() {
        return this.gameWidth
    }
    getNbBomb() {
        return this.gameNbBomb
    }
    getRoomSize() {
        return this.roomSize
    }

    getHostID() {
        return this.host.id
    }

    getCurentStatus(){

        if (this.game == null){
            throw new Error ("la Game n'est pas crée")
        }

        return this.game.getCurentStatus()
    }

    // getHost() : Client{
    //     return this.host
    // }

    private static AddGameRoom(gameRoom: GameRoom) {
        GameRoom.GameRooms[gameRoom.getRoomID()] = gameRoom;
    }

    static GetGameRoom(roomID: number): GameRoom | null {
        const gameroom = GameRoom.GameRooms[roomID]
        return gameroom ? gameroom : null
    }

    static DeleteGameRoom(gameRoom: GameRoom): void {
        delete GameRoom.GameRooms[gameRoom.roomID]
    }
}