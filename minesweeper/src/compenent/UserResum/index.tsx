import React from "react";
import "./styles.css"

import TokenManager from "../../server/TokenManager";
import ApiMinesweeper from "../../server/ApiMinesweeper";

type MyState = {
    pseudo : string
    // info : null |
    // {
    //     photo : string,
    //     pseudo : string,
    //     flag : string,
        
    // }
}
type MyProps = {
}

export default class UserResum extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);

        this.state = {pseudo:"Unknow"}

        this.connection()
    }

    async connection(){
        const token = await TokenManager.GetToken()
        const userResum = await ApiMinesweeper.GetPlayerResumByToken(token)
        this.setState({pseudo : userResum.name})
    }

    render(): React.ReactNode {
        return(
            <div className="boxOut userResumBox">
                <div>
                    <h2>{this.state.pseudo}</h2>                    
                </div>
                <button className="boxOut buttonSmal">Sign in</button>
            </div>
        )
    }


}