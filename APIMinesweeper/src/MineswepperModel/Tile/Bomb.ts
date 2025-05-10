import Tile from "./Tile";
import SafeTile from "./Safetile"

export default class Bomb implements Tile{

    discover(): this is SafeTile {
        return false
    }

}