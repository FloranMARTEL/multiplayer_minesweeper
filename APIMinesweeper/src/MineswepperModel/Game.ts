import { start } from "repl";
import Board from "./Board.js";
import SafeTile from "./Tile/Safetile.js";
import Tile from "./Tile/Tile.js";

const DIR = new Set<[number, number]>([[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]]);

enum GameStatus {
    InGame,
    Over
}

export default class Game {

    private board: Board
    private gameStatus: GameStatus
    private discoveredTiles: Set<Tile>
    private flags: Set<number>


    constructor(seed: number | null, height: number, width: number, nbBomb: number) {
        this.board = new Board(seed, height, width, nbBomb)
        this.gameStatus = GameStatus.InGame
        this.discoveredTiles = new Set()
        this.flags = new Set()
    }

    discoverTileWithIndex(index: number): { [key: number]: SafeTile } {
        const startTile: Tile = this.board.getTileWithIndex(index);
        if (this.discoveredTiles.has(startTile)) {
            return {};
        }

        if (!startTile.discover()){
            this.gameStatus = GameStatus.Over
            return {}
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
                for (const direction of DIR) {
                    const [dx, dy] = direction;
                    const targetIndex = currentIndex + dx * this.board.width + dy;

                    if (targetIndex >= 0 && targetIndex < this.board.indexlimit) {
                        const neighborTile = this.board.getTileWithIndex(targetIndex);
                        if (!this.discoveredTiles.has(neighborTile)) {
                            this.discoveredTiles.add(neighborTile)
                            stack.push(targetIndex);
                        }
                    }
                }
            }
        }

        return tilesFound;
    }

    discoverTileWithRowAndCol(row: number, col: number): { [key: number]: SafeTile } {
        const index = row * this.board.width + col
        return this.discoverTileWithIndex(index);
    }

    placeFlag(index: number) {

        if (index >= this.board.indexlimit) {
            throw Error("you can't put flag hire")
        }

        this.flags.add(index);
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
}