
import React, { JSX } from "react"

import PlayerResumState from "../PlayerResumState"
import "./styles.css"

type MyState = {
    playersState : { [key : number] : {nbTiles : number}}
}

type MyProps = {
    players : { [key : number]: { name: string, flag: string }}
}

export default class PlayersListGame extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)

        const playersState : { [key : number] : {nbTiles : number}} = {}
        for (const userId in this.props.players){
            playersState[userId] = {nbTiles : 0}
        }
        this.state = {playersState}
    }

    addCptTiles(userId : number, nbTilesAdd : number){
        this.state.playersState[userId].nbTiles += nbTilesAdd
        this.setState({}) //update the component

    }

    render(): React.ReactNode {
        

        const playersList : JSX.Element[] = []

        for (const userId in this.props.players){
            const player = this.props.players[userId]
            const element = <PlayerResumState key={userId} photo={"/test.jpg"} name={player.name} flag={`/flag/${player.flag}.png`} nbTiles={this.state.playersState[userId]?.nbTiles || 0}/>
            playersList.push(element)
        }
        
        return(
            <div className="boxOut playerListBox">
                <div className="boxIn"><h2>Players</h2></div>
                <div >
                    {playersList}
                </div>
            </div>
        )
    }

    
}