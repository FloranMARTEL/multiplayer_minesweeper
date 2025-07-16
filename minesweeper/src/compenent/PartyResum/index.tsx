import React from "react";
import { NavigateFunction } from 'react-router-dom';


import ButtonSmal from "../ButtonSmal";

import "./styles.css"

type MyState = {
}
type MyProps = {
    height : number
    width : number
    nbBomb : number
    nbPlayers : number
    nbPlayersMax : number
}
export default class PartyResum extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {

        
        return(
            <section className="boxOut partyResum">
                <div>
                    <span>Size : {this.props.height}x{this.props.width}</span>
                    <span>Bomb : {this.props.nbBomb}</span>
                    <span><img src="/icon/smile.png" alt="smile" /> {this.props.nbPlayers}/{this.props.nbPlayersMax} </span>
                </div>

                <ButtonSmal onClick={()=>{console.log("todo")}} text={"Join"}/>
            </section>
        )
    }
}