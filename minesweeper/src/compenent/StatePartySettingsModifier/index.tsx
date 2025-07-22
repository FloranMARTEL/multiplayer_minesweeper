

import React from "react";
import ButtonImg from "../ButtonImg";

import { ReactNode } from 'react';

type MyState = {
}
type MyProps = {
    sendUpdateStateGame: (height : number, width : number, nbBomb : number, roomSize : number) => void
    onClickCancel: () => void
    state: {
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number,
    }
    nbPlayers : number
}
export default class StatePartySettingsModifier extends React.Component<MyProps, MyState> {
    
    private heightInputRef : React.RefObject<HTMLInputElement | null>;
    private widthInputRef : React.RefObject<HTMLInputElement | null>;
    private nbBombInputRef : React.RefObject<HTMLInputElement | null>;
    private roomSizeInputRef : React.RefObject<HTMLInputElement | null>;

    constructor(props: MyProps) {
        super(props);
        this.heightInputRef = React.createRef<HTMLInputElement>();
        this.widthInputRef = React.createRef<HTMLInputElement>();
        this.nbBombInputRef = React.createRef<HTMLInputElement>();
        this.roomSizeInputRef = React.createRef<HTMLInputElement>();
    }

    onClickCheckSettings(){
        this.props.onClickCancel()
        if (this.heightInputRef.current &&
            this.widthInputRef.current &&
            this.nbBombInputRef.current &&
            this.roomSizeInputRef.current
        ){
            const height = Number(this.heightInputRef.current.value)
            const width = Number(this.widthInputRef.current.value)
            const nbBomb = Number(this.nbBombInputRef.current.value)
            const roomSize = Number(this.roomSizeInputRef.current.value)
            this.props.sendUpdateStateGame(height,width,nbBomb,roomSize)

        }        
    }

    render(): ReactNode {

        const gamestatusbox =
                <div className="boxIn stateRoom">
                    <div>
                        <span><label htmlFor="height">Height</label> <input ref={this.heightInputRef} type="text" autoComplete="off" id="height" name="height" defaultValue={this.props.state.height} /></span>
                        <span><label htmlFor="width">Width</label> <input ref={this.widthInputRef} type="text" autoComplete="off" id="width" name="width" defaultValue={this.props.state.width} /></span>
                        <span><label htmlFor="nbBomb">Bomb</label> <input ref={this.nbBombInputRef} type="text" autoComplete="off" id="nbBomb" name="nbBomb" defaultValue={this.props.state.nbBomb} /></span>
                        <span>
                            <img src="/icon/smile.png" alt="smile" />
                            {this.props.nbPlayers}
                            /
                            <input ref={this.roomSizeInputRef} type="text" autoComplete="off" id="roomSize" name="roomSize" defaultValue={this.props.state.roomSize} />
                        </span>

                    </div>
                    <div>
                        <span>roomId : {this.props.state.roomId}</span>

                    </div>
                </div>

        const buttonBox = 
                        <div>
                            <ButtonImg onClick={() => this.onClickCheckSettings()} src="/icon/correct.svg" alt="correct" />
                            <ButtonImg onClick={this.props.onClickCancel} src="/icon/croix.svg" alt="croix" />
                        </div>


        return (
            <div className="stateBox">
                {gamestatusbox}
                {buttonBox}
            </div>
        )
    }
}