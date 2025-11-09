
import React, { JSX } from "react"

import PlayerResumState from "../PlayerResumState"
import "./styles.css"

type MyState = {
    playersState : { [key : number] : {nbTiles : number}}
}

type MyProps = {
    players : number[]
}

export default class PlayersListGame extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)

        const playersState : { [key : number] : {nbTiles : number}} = {}
        for (const userId of this.props.players){
            playersState[userId] = {nbTiles : 0}
        }
        this.state = {playersState}
    }

    setCptTiles(playersState : { [key : number] : {nbTiles : number}}){
        this.setState({playersState:playersState})
    }

    addCptTiles(userId : number, nbTilesAdd : number){
        const copPlayersate = this.state.playersState
        copPlayersate[userId].nbTiles += nbTilesAdd // m'auvais pratique
        // il faut recrée une list
        this.setState({playersState : copPlayersate}) //update the component
    }

    render(): React.ReactNode {
        

        const playersList : JSX.Element[] = []

        for (const userId of this.props.players){
            const element = <PlayerResumState key={userId} id={Number(userId)} nbTiles={this.state.playersState[userId]?.nbTiles || 0}/>
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