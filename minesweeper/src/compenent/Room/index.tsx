import React, { JSX } from "react"

import {  NavigateFunction } from 'react-router-dom';


import Button from "../Button"
import PlayerResum from "../PlayerResum"
import StatePartySettings from "../StatePartySettings"
import StatePartySettingsModifier from "../StatePartySettingsModifier"

import "./styles.css"
import ButtonSmal from "../ButtonSmal"

type MyState = {
    host: boolean
    settings: boolean
}

type MyProps = {
    host?: boolean,
    sendUpdateStateGame?: (height: number, width: number, nbBomb: number, roomSize: number) => void,
    startGame: () => void,
    sendLeaveGame: () => void,
    navigate: NavigateFunction
    state: null | {
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number
    },
    players: number[]
}

export default class Room extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props)

        if (this.props.host) {
            this.state = { host: true, settings: false }
        } else {
            this.state = { host: false, settings: false }
        }

    }

    setStateSettings(settings: boolean) {
        this.setState({ settings: settings })
    }

    buttonLeaveGame() {
        this.props.sendLeaveGame()
        this.props.navigate("/")
    }

    render() {

        const title = this.state.host ? "Create Room" : "Join Room";

        let startGameButton = null

        if (this.state.host && this.state.settings === false) {
            startGameButton = <Button onClick={() => this.props.startGame()} text="Start" />
        }

        const nbplayer = Object.keys(this.props.players).length
        const statebox = (this.props.state) ?
            (this.state.settings && this.state.host && this.props.sendUpdateStateGame !== undefined) ?
                <StatePartySettingsModifier
                    onClickCancel={() => this.setStateSettings(false)}
                    sendUpdateStateGame={this.props.sendUpdateStateGame}
                    state={this.props.state}
                    nbPlayers={nbplayer} />
                :
                <StatePartySettings host={this.state.host}
                    onClickSettings={() => this.setStateSettings(true)}
                    state={this.props.state}
                    nbPlayers={nbplayer} />
            :
            null




        const playerbox: JSX.Element[] = []
        let i = 0
        for (const userId of this.props.players) {
            playerbox.push(<PlayerResum key={++i} id={Number(userId)} />)
        }


        return (
            <div>
                <div className="boxOut roomBox">
                    <div className="boxIn"><h2>{title}</h2></div>

                    {statebox}

                    <div className="boxIn playerResumBox">
                        {playerbox}
                    </div>
                    {startGameButton}

                </div>

                <ButtonSmal onClick={() => this.buttonLeaveGame()} text="leave" />
            </div>

        )
    }

}
