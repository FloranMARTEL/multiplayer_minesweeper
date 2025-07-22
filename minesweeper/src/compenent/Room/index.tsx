import React, { JSX } from "react"

import Button from "../Button"
import PlayerResum from "../PlayerResum"
import StatePartySettings from "../StatePartySettings"
import StatePartySettingsModifier from "../StatePartySettingsModifier"

import "./styles.css"

type MyState = {
    host: boolean
    settings : boolean
}

type MyProps = {
    host?: boolean,
    sendUpdateStateGame? : (height : number, width : number, nbBomb : number, roomSize : number) => void,
    startGame : () => void,
    state: null | {
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number
    },
    players : { [key : number]: { name: string, flag: string }}
}

export default class Room extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)

        if (this.props.host) {
            this.state = { host: true, settings : false}
        } else {
            this.state = { host: false, settings : false}
        }


    }

    setStateSettings(settings : boolean){
        this.setState({settings : settings})
    }

    render() {

        const title = this.state.host ? "Create Room" : "Join Room";

        let startGameButton = null

        if (this.state.host) {
            startGameButton = <Button onClick={()=>this.props.startGame()} text="Start" />
        }

        const nbplayer = Object.keys(this.props.players).length 
        const statebox = (this.props.state)?
                            (this.state.settings && this.state.host && this.props.sendUpdateStateGame !== undefined)?
                                <StatePartySettingsModifier
                                    onClickCancel={() => this.setStateSettings(false)} 
                                    sendUpdateStateGame={this.props.sendUpdateStateGame}
                                    state={this.props.state}
                                    nbPlayers={nbplayer}/>
                                :
                                <StatePartySettings host={this.state.host}
                                onClickSettings={() => this.setStateSettings(true)}
                                state={this.props.state}
                                nbPlayers={nbplayer}/>
                            :
                            null

    
        

        const playerbox : JSX.Element[] = []
        let i = 0
        for (const userId in this.props.players){
            const player = this.props.players[userId]
            playerbox.push(<PlayerResum key={++i} photo={"/test.jpg"} name={player.name} flag={`/flag/${player.flag}.png`} />)
        }


        return (

            <div className="boxOut roomBox">
                <div className="boxIn"><h2>{title}</h2></div>

                {statebox}

                <div className="boxIn playerResumBox">
                    {playerbox}
                </div>
                {startGameButton}

            </div>


        )
    }

}
