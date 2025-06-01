import Tile from "./Tile.js";
import SafeTile from "./Safetile.js"

export default class Bomb implements Tile{

    discover(): this is SafeTile {
        return false
    }

}