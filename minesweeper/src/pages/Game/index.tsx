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
            console.log("connected");

            client.send(JSON.stringify({
                type: "CreateGame",
                width: 10,
                height: 10,
                nbBomb: 10,
            }))
        }
        client.onmessage = (event: MessageEvent) => {
            console.log(" <-- " + event.data.toString())
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
        }
        client.onclose = () => {
            console.log("connection closed")
        }
    }

    onclick() {
        console.log("bonjour");
        client.send(JSON.stringify({
            type: "message",
            msg: "bonjour",
        }))
    }

    clickOnCell(r: number, c: number) {
        console.log("click")
        client.send(JSON.stringify({
            type: "ShowCell",
            row: r,
            col: c
        }))
    }

    render() {
        console.log("test")

        let board = null
        if (this.state.boardstate != null) {
            board = <Board ref={this.boardRef} height={this.state.boardstate.height} width={this.state.boardstate.width} nbBomb={this.state.boardstate.nbBomb} eventCell={this.clickOnCell}></Board>
        }
        return (
            <div>
                {board}
            </div>
        )
    }
}