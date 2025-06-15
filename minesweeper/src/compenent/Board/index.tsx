import React, { JSX } from "react";

import "./styles.css";

import Cell from "../Cell";

type MyState = {}
type MyProps = {
    height: number,
    width: number,
    nbBomb: number,
    sendDiscoverTile: (r: number, c: number) => void
    sendSetFlag: (r: number, c: number) => void
    sendRemouveFlag: (r: number, c: number) => void
}

export default class Board extends React.Component<MyProps, MyState> {

    tiles : React.RefObject<Cell | null>[][]

    constructor(props: MyProps) {
        super(props);

        //generate grid
        this.tiles = []
        for (let l = 0; l < this.props.height; l++) {
            this.tiles.push([])
            for (let c = 0; c < this.props.width; c++) {
                this.tiles[l].push(React.createRef<Cell>())
            }
        }
    }

    updateTiles(tilesdict: { [key: number]: number }) {
        for (const indextile in tilesdict) {
            const indexTileNumber = Number(indextile)
            const row = Math.floor(indexTileNumber/this.props.width)
            const col = indexTileNumber%this.props.width
            const tileref = this.tiles[row][col]
            if (tileref.current){
                tileref.current.updateValue(tilesdict[indextile])
            }
        }
    }

    setflag(row:number, col : number){
        const tileref = this.tiles[row][col]
        
        if (tileref.current){
            tileref.current.setFlag()
        }
    }

    
    remouveflag(row:number, col : number){
        const tileref = this.tiles[row][col]
        
        if (tileref.current){
            tileref.current.remouveFlag()
        }
    }

    render() {


        const rows = [];
        for (let l = 0; l < this.props.height; l++) {
            const columne: JSX.Element[] = [];

            for (let c = 0; c < this.props.width; c++) {
                columne.push(
                    <Cell ref={this.tiles[l][c]}
                    key={c}
                    sendDiscoverTile={() => this.props.sendDiscoverTile(l, c)}
                    sendSetFlag={()=> this.props.sendSetFlag(l,c)}
                    sendRemouveFlag={()=> this.props.sendRemouveFlag(l,c)}
                    />
                );
            }

            rows.push(
                <div key={l}> {columne} </div>
            );
        }




        return (
            <div className="board">
                {rows}
            </div>
        );

    }
}