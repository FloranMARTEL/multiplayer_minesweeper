
import React, { JSX, useReducer } from "react"
import ApiMinesweeper from "../../server/ApiMinesweeper"
import PlayerResum from "../PlayerResum"



type MyProps = {
    id : number
    nbTiles : number
}

export default class PlayerResumState extends PlayerResum<MyProps> {


    render(): React.ReactNode {


        const photo = (this.state.photo)?
                        <img className="boxIn" src={this.state.photo} alt={this.state.photo} />
                        :
                        null
        
        const flag = (this.state.flag)?
                        <img src={this.state.flag} alt={this.state.flag} />
                        :
                        null


        return (
            <div className="boxOut playerResumStat">
                {photo}
                <div>
                    <div>
                        <span>{this.state.name}</span>
                        {flag}
                    </div>
                    <div>
                        <span>Discovery Tiles</span>
                        <span>{this.props.nbTiles}</span>
                    </div>
                </div>

            </div>
        )
    }


}