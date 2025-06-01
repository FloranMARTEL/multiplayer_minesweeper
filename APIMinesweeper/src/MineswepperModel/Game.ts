import Board from "./Board.js";
import Tile from "./Tile/Tile.js";

const DIR = new Set<[number, number]>([[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]]);

enum GameStatus {
    InGame,
    Over
}

class Game {

    board: Board
    gameStatus: GameStatus
    discoveredTiles : Set<Tile>
    flags : Set<number>



    constructor(seed: number | null, hight: number, width: number, nbBomb: number) {
        this.board = new Board(seed, hight, width, nbBomb)
        this.gameStatus = GameStatus.InGame
        this.discoveredTiles = new Set()
        this.flags = new Set()
    }

    discoverTileWithIndex(index: number) : Set<Tile> {
        const tile: Tile = this.board.getTileWithIndex(index)
        if (this.discoveredTiles.has(tile)){
            return new Set()
        }

        let tilesfound : Set<Tile> = new Set()

        if (!tile.discover()) {
            this.gameStatus = GameStatus.Over
        } else {
            this.discoveredTiles.add(tile)
            tilesfound.add(tile)
            const value = tile.getValue()
            if (value == 0) {
                DIR.forEach((direction: [number, number]) => {
                    const targetIndex = index + direction[0] * this.board.width + direction[1];
                    if (targetIndex < this.board.indexlimit) {
                        tilesfound = new Set([...tilesfound,...this.discoverTileWithIndex(targetIndex)]);
                    }
                })
            }
        }

        return tilesfound
    }

    placeFlag( index : number){

        if (index >= this.board.indexlimit){
            throw Error("you can't put flag hire")
        }

        this.flags.add(index);
    }
}