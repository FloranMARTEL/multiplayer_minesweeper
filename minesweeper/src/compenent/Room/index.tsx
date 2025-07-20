import React, { JSX } from "react"

import Button from "../Button"
import ButtonImg from "../ButtonImg"
import PlayerResum from "../PlayerResum"

import "./styles.css"

type MyState = {
    host: boolean

}

type MyProps = {
    host?: boolean,
    startGame : () => void,
    state: null | { // déplacer se si dans le game manager
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number
    },
    players : {name : string, flag: string}[]
}

export default class Room extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)

        if (this.props.host) {
            this.state = { host: true}
        } else {
            this.state = { host: false}
        }


    }

    updateplayerlist(idPlayers: number[]) {
        console.log("todo", idPlayers)
    }

    startGame() {
        console.log("Start Game")
    }

    render() {

        const title = this.state.host ? "Create Room" : "Join Room";

        let startGameButton = null

        if (this.state.host) {
            startGameButton = <Button onClick={()=>this.props.startGame()} text="Start" />
        }

        const gamestatusbox =
            (this.props.state !== null) ?

                <div className="boxIn stateRoom">
                    <div>
                        <span>Height : {this.props.state.height}</span>
                        <span>Width : {this.props.state.width}</span>
                        <span>Bomb : {this.props.state.nbBomb}</span>
                        <span>
                            <img src="/icon/smile.png" alt="smile" />
                             {this.props.players.length}/{this.props.state.roomSize}
                        </span>

                    </div>
                    <div>
                        <span>roomId : {this.props.state.roomId}</span>

                    </div>
                </div>
                : <div className="boxIn"></div>
        

        const playerbox : JSX.Element[] = []
        let i = 0
        this.props.players.forEach((player)=>{
            playerbox.push(<PlayerResum key={++i} photo={"/test.jpg"} name={player.name} flag={`/flag/${player.flag}.png`} />)
        })

        return (

            <div className="boxOut roomBox">
                <div className="boxIn"><h2>{title}</h2></div>
                <div className="stateBox">
                {gamestatusbox}
                <ButtonImg onClick={()=>(console.log("Todo"))} src="/icon/engrenage.png" alt="engrenage"/>
                </div>

                <div className="boxIn playerResumBox">
                    {playerbox}
                </div>
                {startGameButton}

            </div>


        )
    }

}
