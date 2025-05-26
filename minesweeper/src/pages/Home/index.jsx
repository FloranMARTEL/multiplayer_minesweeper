import React from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:5000');


export default class Home extends React.Component{
    
    constructor(props){
        super(props);
        client.onopen = () =>{
            console.log("connected");
        }
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