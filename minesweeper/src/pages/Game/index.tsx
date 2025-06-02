import React from "react";
import { data } from "react-router-dom";

import Board from "../../compenent/Board";

const client = new WebSocket('ws://localhost:5000');

type MyState = { boardstate: null | { height: number, width: number, nbBomb: number } }
type MyProps = {}

export default class Game extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props);

        this.state = {
            boardstate: null
        }

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
            if (jsonmessage.type = "CreateGame") {
                this.setState({
                    boardstate: {
                        height: jsonmessage.height,
                        width: jsonmessage.width,
                        nbBomb: jsonmessage.nbBomb
                    }
                })
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

    render() {

        let board = <div></div>
        if (this.state.boardstate != null) {
            board = <Board height={this.state.boardstate.height} width={this.state.boardstate.width} nbBomb={this.state.boardstate.nbBomb} ></Board>
        }
        return (
            <div>
                {board}
            </div>
        )
    }
}