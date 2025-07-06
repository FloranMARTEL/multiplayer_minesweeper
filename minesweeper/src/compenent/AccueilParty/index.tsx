import React from "react";

import Button from "../Button";

import PartyResum from "../PartyResum";

import "./styles.css"

type MyState = {
}
type MyProps = {
}
export default class AccueilParty extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="boxOut home">
                <div className="boxIn"><h2>Party Public</h2></div>
                <div className="boxIn listringPartyBox">
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                    <PartyResum height={100} width={100} nbBomb={1000} nbPlayers={2} nbPlayersMax={8} />
                </div>
                <div className="managerGameButtonBox">
                    <Button onClick={()=>{console.log("todo")}} text={"Create Game"} />
                    <Button onClick={()=>{console.log("todo")}} text={"Join Game"} />
                </div>
            </div>
        )
    }
}