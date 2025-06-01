import Tile from "./Tile.js"

export default class SafeTile implements Tile{

    private value : number = 0


    incrementValue(): void{
        this.value++
    }

    getValue(): number{
        return this.value
    }

    discover(): this is SafeTile {
        return true
    }
}