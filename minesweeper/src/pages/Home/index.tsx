import React from "react";
import { data } from "react-router-dom";

const client = new WebSocket('ws://localhost:5000');

type State = {}
type Props = {}

export default class Home extends React.Component<Props, State> {
    
    constructor(props : Props){
        super(props);
        client.onopen = () =>{
            console.log("connected");
        }
        client.onmessage = (event : MessageEvent) => {
            const data = event.data
            console.log(" <- " + data.toString())
        }
        client.onclose = () => {
            console.log("connection closed")
        }


        client.send(JSON.stringify({
            type : "CreateGame",
            width : 10,
            heigth : 10,
            boomb : 10,
        }))
    }

    onclick(){
        console.log("bonjour");
        client.send(JSON.stringify({
            type : "message",
            msg: "bonjour",
        }))
    }

    render(){
        return(
            <div>
                <button onClick={this.onclick}>Send</button>
            </div>
        )
    }
}