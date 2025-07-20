import React from "react";
import { useNavigate,NavigateFunction } from 'react-router-dom';


import Button from "../Button";

import PartyResum from "../PartyResum";
import PopUpJoinGame from "../PopUpJoinGame";

import "./styles.css"

export default function AccueilParty(){
  const navigate = useNavigate();
 return (
    <AccueilPartyWrapper navigate={navigate} ></AccueilPartyWrapper>
 )
}

type MyState = {
    showPopUp : boolean
}
type MyProps = {
    navigate : NavigateFunction
}
class AccueilPartyWrapper extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);

        this.state = {showPopUp : false}
    }


    showJoinWindow(){
        this.setState({showPopUp : true})
    }

    remouveJoinWindow(){
        this.setState({showPopUp : false})
    }

    //props.navigate("/game/joinRoom")

    render(): React.ReactNode {

        const popUp = (this.state.showPopUp)? <PopUpJoinGame navigate={this.props.navigate} onLeaveClick={()=>{this.remouveJoinWindow()}}/>
                                               : null

        return(
            <div className="boxOut home">
                <div className="boxIn"><h2>Party Public</h2></div>
                <div className="boxIn listringPartyBox">
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                </div>
                <div className="managerGameButtonBox">
                    <Button onClick={()=>{this.props.navigate("/game/createRoom")}} text={"Create Game"} />
                    <Button onClick={()=>{this.showJoinWindow()}} text={"Join Game"} />
                </div>
                {popUp}
            </div>
        )
    }
}