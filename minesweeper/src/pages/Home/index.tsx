import React from "react";


import AccueilParty from "../../compenent/AccueilParty";
import Settings from "../../compenent/Settings";
import UserResum from "../../compenent/UserResum";

import "./styles.css";



type State = {}
type Props = {
}
export default class Home extends React.Component<Props, State> {


    render(){
        return(
            <main>
                <div>
                    <AccueilParty/>
                    <Settings/>
                </div>
                <UserResum/>
                
            </main>
        )
    }
}