import React from "react";


import AccueilParty from "../../compenent/AccueilParty";
import Settings from "../../compenent/Settings";
import UserResum from "../../compenent/UserResum";

import "./styles.css";



type State = {}
type Props = {
}
export default class Home extends React.Component<Props, State> {
    
    constructor(props : Props){
        super(props);
    }

    render(){
        return(
            <main>
                <div>
                    <AccueilParty/>
                    <Settings/>
                </div>
                <UserResum/>
                
                {/* <button onClick={()=>{this.props.navigate("/game/createRoom")}}>Crée une partie</button>
                <button onClick={()=>{this.props.navigate("/game/joinRoom")}}>rejoindre une partie</button> */}
            </main>
        )
    }
}