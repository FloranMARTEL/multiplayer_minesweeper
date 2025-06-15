import Bomb from "./Tile/Bomb.js"
import SafeTile from "./Tile/Safetile.js"
import Tile from "./Tile/Tile.js"


const DIR = new Set<[number, number]>([[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]]);


export default class Board {

    seed: number
    height: number
    width: number
    indexlimit : number
    nbBomb: number
    tiles: Tile[]


    constructor(seed: number | null, height: number, width: number, nbBomb: number) {

        if (seed == null) {
            seed = Math.random()
        }
        this.seed = seed

        this.height = height
        this.width = width
        this.nbBomb = nbBomb

        this.indexlimit = this.height * this.width

        this.tiles = []
        this.init_tiles()
        
    }


    init_tiles(){
        const indexs: number[] = []

        for (let i = 0; i < this.indexlimit; i++) {
            indexs.push(i);
        }

        const randfonc = JSF(this.seed)

        shuffle(indexs, randfonc)

        const indexBomb = new Set<number>();
        for (let i = 0; i < this.nbBomb; i++) {
            indexBomb.add(indexs[i]);
        }

        for (let i = 0; i < this.indexlimit; i++) {
            let newTile: Tile
            if (indexBomb.has(i)) {
                newTile = new Bomb()
            } else {
                newTile = new SafeTile()
            }
            this.tiles.push(newTile)
        }


        indexBomb.forEach((index: number) => {
            const row = Math.floor(index/this.width)
            const col = index%this.width

            DIR.forEach(( direction : [number,number])=>{
                
                const rowtarget = row + direction[0]
                const coltarget = col + direction[1]
                const targetIndex = index + direction[0]*this.width + direction[1];


                if ( rowtarget >= 0 && rowtarget < this.height &&
                    coltarget >= 0 && coltarget < this.width
                ){
                    const tagetTile : Tile = this.tiles[targetIndex]
                    if (tagetTile instanceof SafeTile){
                        tagetTile.incrementValue()
                    }

                }
            })
        })
    }

    getTile(row: number,colone:number): Tile{
        const index = row*this.width + colone
        return this.getTileWithIndex(index);
    }

    getTileWithIndex(index : number) : Tile{
        if (index >= this.indexlimit || index < 0){
            throw Error("index out of board");
        }
        const tile : Tile = this.tiles[index];
        return tile;
    }
}

function shuffle<T>(a: T[], rng: () => number) {

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function JSF(seed: number): () => number {
    function jsf() {
        var e = s[0] - (s[1] << 27 | s[1] >>> 5);
        s[0] = s[1] ^ (s[2] << 17 | s[2] >>> 15),
            s[1] = s[2] + s[3],
            s[2] = s[3] + e, s[3] = s[0] + e;
        return (s[3] >>> 0) / 4294967296; // 2^32
    }
    var seed1 = Math.floor(seed / 4294967296);
    seed >>>= 0;
    var s = [0xf1ea5eed, seed, seed1, seed];

    for (var i = 0; i < 20; i++) jsf();
    return jsf;
}