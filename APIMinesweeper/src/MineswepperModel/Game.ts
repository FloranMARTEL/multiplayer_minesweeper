import { start } from "repl";
import Board from "./Board.js";
import SafeTile from "./Tile/Safetile.js";
import Tile from "./Tile/Tile.js";

const DIR = new Set<[number, number]>([[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]]);

export enum GameStatus {
    InGame,
    Lost,
    Win,
}

export default class Game {

    private board: Board
    private gameStatus: GameStatus
    private discoveredTiles: Set<Tile>

    private flags: { [key : number] : Set<number>}
    private cptTileDiscoverd: { [key : number] : number}

    constructor(seed: number | null, height: number, width: number, nbBomb: number, idplayers : number[]) {
        this.board = new Board(seed, height, width, nbBomb)
        this.gameStatus = GameStatus.InGame
        this.discoveredTiles = new Set()

        this.flags = {}
        this.cptTileDiscoverd = {}
        idplayers.forEach((idplayer)=>{
            this.flags[idplayer] = new Set<number>()
            this.cptTileDiscoverd[idplayer] = 0
        })
    }

    discoverTileWithIndex(index: number,numplayer : number): {tiles : { [key: number]: SafeTile }, nbTiles : number} {
        const startTile: Tile = this.board.getTileWithIndex(index);
        if (this.discoveredTiles.has(startTile)) {
            return {tiles :{}, nbTiles :0};
        }

        if (!startTile.discover()) {
            this.gameStatus = GameStatus.Lost
            return {tiles :{}, nbTiles :0};
        }

        this.discoveredTiles.add(startTile);

        const tilesFound: { [key: number]: SafeTile } = {};
        const stack: number[] = [index];

        while (stack.length > 0) {
            const currentIndex = stack.pop()!;
            const tile = this.board.getTileWithIndex(currentIndex) as SafeTile;

            tilesFound[currentIndex] = tile;

            const value = tile.getValue();
            if (value === 0) {

                const row = Math.floor(currentIndex / this.board.width)
                const col = currentIndex % this.board.width

                for (const direction of DIR) {
                    const [dx, dy] = direction;
                    const rowtarget = row + dx
                    const coltarget = col + dy

                    const targetIndex = rowtarget * this.board.width + coltarget;

                    if (rowtarget >= 0 && rowtarget < this.board.height &&
                        coltarget >= 0 && coltarget < this.board.width
                    ) {
                        const neighborTile = this.board.getTileWithIndex(targetIndex);
                        if (!this.discoveredTiles.has(neighborTile)) {
                            this.discoveredTiles.add(neighborTile)
                            stack.push(targetIndex);
                        }
                    }
                }
            }
        }

        const nbTiles = Object.keys(tilesFound).length
        this.cptTileDiscoverd[numplayer] += nbTiles

        //
        if (this.discoveredTiles.size === this.board.width * this.board.height - this.board.nbBomb){
            this.gameStatus = GameStatus.Win
        }
        //

        return {tiles : tilesFound, nbTiles : nbTiles};
    }

    discoverTileWithRowAndCol(row: number, col: number, numplayer : number): {tiles : { [key: number]: SafeTile }, nbTiles : number} {
        const index = row * this.board.width + col
        return this.discoverTileWithIndex(index, numplayer);
    }

    placeFlagWithRowAndCol(row: number, col: number, idplayer: number) {
        const index = this.RowAndColToIndex(row, col)
        this.placeFlag(index, idplayer)
    }

    placeFlag(index: number, idplayer: number) {
        if (index >= this.board.indexlimit) {
            throw Error("you can't put flag hire")
        }
        this.flags[idplayer].add(index);
    }

    RemouveFlagWithRowAndCol(row: number, col: number, numplayer: number) {
        const index = this.RowAndColToIndex(row, col)
        this.RemouveFlag(index, numplayer)
    }

    RemouveFlag(index: number, numplayer: number) {
        if (index >= this.board.indexlimit) {
            throw Error("you can't put flag hire")
        }
        this.flags[numplayer].delete(index);
    }


    getwidth() {
        return this.board.width
    }
    getheight() {
        return this.board.height
    }
    getnbBomb() {
        return this.board.nbBomb
    }

    getGameStatus(): GameStatus {
        return this.gameStatus
    }


    private indexToRowAndCol(index: number): { row: number, col: number } {
        const row = Math.floor(index / this.board.width)
        const col = index % this.board.width
        return { row, col }
    }

    private RowAndColToIndex(row: number, col: number): number {
        const index = row * this.board.width + col
        return index
    }


}