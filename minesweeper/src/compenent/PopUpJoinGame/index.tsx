import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import ButtonSmal from '../ButtonSmal';

import "./styles.css"

type MyState = {
}
type MyProps = {
    navigate : NavigateFunction
    onLeaveClick : () => void
}
export default class PopUpJoinGame extends React.Component<MyProps, MyState> {

    private inputRef: React.RefObject<HTMLInputElement | null>;

    constructor(props: MyProps) {
        super(props);

        this.inputRef = React.createRef<HTMLInputElement>();

    }

    onjoinGameClick(){
        
        if (this.inputRef.current){
            const inputValue = this.inputRef.current.value
            const inputValueInt = parseInt(inputValue)
            this.props.navigate("/game/joinRoom/"+inputValue)
        }

    }

    render(): React.ReactNode {
        

        return (
            <div className='boxOut popUpJoinGame'>
                <div className='boxIn'><h2>Join Game</h2></div>
                <div>
                    <label htmlFor="roomId"><h2>Room ID</h2></label>
                    <input type="numberici" name="roomId" id="roomId" ref={this.inputRef}/>
                    <ButtonSmal onClick={()=>{this.onjoinGameClick()}} text="Join Game" />    
                </div>
                <ButtonSmal onClick={this.props.onLeaveClick} text="leave" />
            </div>
        )
    }
}