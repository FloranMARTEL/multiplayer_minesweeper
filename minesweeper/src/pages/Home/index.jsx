import React from "react";

const client = new WebSocket('ws://localhost:5000');

export default class Home extends React.Component{
    
    constructor(props){
        super(props);
        client.onopen = () =>{
            console.log("connected");
        }

        client.onmessage = (event) => {

            const data = event.data
            console.log(" <- " + data.toString())

        }

        client.onclose = () => {
            console.log("connection closed")
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