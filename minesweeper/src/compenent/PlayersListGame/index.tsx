
import React, { JSX } from "react"

import PlayerResumState from "../PlayerResumState"
import "./styles.css"

type MyState = {
}

type MyProps = {
    players : {name : string, flag: string}[]
}

export default class PlayersListGame extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)
    }

    render(): React.ReactNode {

        const playersList : JSX.Element[] = []

        this.props.players.forEach((player,i) => {
            const element = <PlayerResumState key={i} photo={"/test.jpg"} name={player.name} flag={`/flag/${player.flag}.png`}/>
            playersList.push(element)
        })
        
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