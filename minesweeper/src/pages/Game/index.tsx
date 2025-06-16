import React from "react";

import Board from "../../compenent/Board";

const client = new WebSocket('ws://localhost:5000');

type MyState = { boardstate: null | { height: number, width: number, nbBomb: number } }
type MyProps = {}

export default class Game extends React.Component<MyProps, MyState> {

    boardRef: React.RefObject<Board | null>;

    constructor(props: MyProps) {
        super(props);

        this.state = {
            boardstate: null
        }

        this.boardRef = React.createRef<Board>();

        client.onopen = () => {
            console.log("Client connected");

            client.send(JSON.stringify({
                type: "CreateGame",
                width: 10,
                height: 10,
                nbBomb: 10,
                id:0
            }))
        }
        client.onmessage = (event: MessageEvent) => {
            const jsonmessage = JSON.parse(event.data.toString());
            console.log(jsonmessage)
            if (jsonmessage.type === "CreateGame") {
                this.setState({
                    boardstate: {
                        height: jsonmessage.height,
                        width: jsonmessage.width,
                        nbBomb: jsonmessage.nbBomb
                    }
                });

            } else if (jsonmessage.type === "ShowCell") {
                const tiles = jsonmessage.tiles as { [key: number]: number }
                if (this.boardRef.current) {
                    this.boardRef.current.updateTiles(tiles)
                }

                console.log(jsonmessage)
            }
            else if (jsonmessage.type === "Flag"){
                const action = jsonmessage.action
                const row = jsonmessage.row
                const col = jsonmessage.col
                if (this.boardRef.current){
                    if (action === "set"){
                        this.boardRef.current.setflag(row,col)
                    }else if (action === "remouve"){
                        this.boardRef.current.remouveflag(row,col)
                    }
                }
                
            }
        }
        client.onclose = () => {
            console.log("connection closed")
        }
    }

    sendDiscoverTile(r: number, c: number) {
        client.send(JSON.stringify({
            type: "ShowCell",
            row: r,
            col: c
        }))
    }

    sendSetFlag(r: number, c: number){
        client.send(JSON.stringify({
            type: "Flag",
            action: "set",
            row: r,
            col: c
        }))
    }

    sendRemouveFlag(r: number, c: number){
        client.send(JSON.stringify({
            type: "Flag",
            action: "remouve",
            row: r,
            col: c
        }))
    }

    render() {
        console.log("test")

        let board = null
        if (this.state.boardstate != null) {
            board = <Board
            ref={this.boardRef}
            height={this.state.boardstate.height}
            width={this.state.boardstate.width}
            nbBomb={this.state.boardstate.nbBomb}
            sendDiscoverTile={this.sendDiscoverTile}
            sendSetFlag={this.sendSetFlag}
            sendRemouveFlag={this.sendRemouveFlag}
            ></Board>
        }
        return (
            <div>
                {board}
            </div>
        )
    }
}