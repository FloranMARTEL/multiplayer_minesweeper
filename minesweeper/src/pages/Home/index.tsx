import React from "react";

import { useParams, useNavigate, useLocation, NavigateFunction, Location, Params } from 'react-router-dom';

import AccueilParty from "../../compenent/AccueilParty";
import Settings from "../../compenent/Settings";

import "./styles.css";

export default function HomeWrapper(){
  const navigate = useNavigate();
 return (
    <Home navigate={navigate} ></Home>
 )
}


type State = {}
type Props = {
    navigate:NavigateFunction
}
class Home extends React.Component<Props, State> {
    
    constructor(props : Props){
        super(props);
    }

    render(){
        return(
            <main>

                <AccueilParty/>
                <Settings/>
                
                {/* <button onClick={()=>{this.props.navigate("/game/createRoom")}}>Crée une partie</button>
                <button onClick={()=>{this.props.navigate("/game/joinRoom")}}>rejoindre une partie</button> */}
            </main>
        )
    }
}