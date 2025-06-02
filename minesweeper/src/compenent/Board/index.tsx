import React, { JSX } from "react";

import "./styles.css"

type MyState = {}
type MyProps = {
    height: number,
    width: number,
    nbBomb: number
}

export default class Board extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props);
    }

    tileClick(l : number,c : number){
        console.log("bonjour "+l+" "+c)
    }


    render() {
        const rows: JSX.Element[] = [];
        for (let l = 0; l < this.props.height; l++) {
            
            const columne: JSX.Element[] = [];

            for (let c = 0; c < this.props.width; c++) {
                columne.push(
                    <div key={c} onClick={() => this.tileClick(l,c)}></div>
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