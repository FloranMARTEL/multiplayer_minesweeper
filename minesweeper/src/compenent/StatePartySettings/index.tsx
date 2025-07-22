

import React from "react";
import ButtonImg from "../ButtonImg";

import { ReactNode } from 'react';

type MyState = {
}
type MyProps = {
    host: boolean
    onClickSettings: () => void
    state: {
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number,
    }
    nbPlayers : number
}
export default class StatePartySettings extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): ReactNode {

        const gamestatusbox =
            (this.props.state !== null) ?

                <div className="boxIn stateRoom">
                    <div>
                        <span>Height : {this.props.state.height}</span>
                        <span>Width : {this.props.state.width}</span>
                        <span>Bomb : {this.props.state.nbBomb}</span>
                        <span>
                            <img src="/icon/smile.png" alt="smile" />
                            {this.props.nbPlayers}/{this.props.state.roomSize}
                        </span>

                    </div>
                    <div>
                        <span>roomId : {this.props.state.roomId}</span>

                    </div>
                </div>
                : <div className="boxIn"></div>

        const paramButton = (this.props.host) ?
            <ButtonImg onClick={this.props.onClickSettings} src="/icon/engrenage.png" alt="engrenage" />
            : null

        return (
            <div className="stateBox">
                {gamestatusbox}
                {paramButton}
            </div>
        )
    }
}