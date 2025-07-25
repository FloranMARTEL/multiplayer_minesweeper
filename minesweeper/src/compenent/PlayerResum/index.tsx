import React from "react"
import ApiMinesweeper from "../../server/ApiMinesweeper"

type MyState = {
    photo : null | string,
    name : string,
    flag : null | string
}
type MyProps = {
    id : number
}

export default class PlayerResum<P extends MyProps = MyProps> extends React.Component<P, MyState> {


    constructor(props: P) {
        super(props);

        this.state = {photo : null, name : "Unknow",flag : null}
        this.getDataUser(this.props.id)
    }

    async getDataUser(id : number){
            const userResum = await ApiMinesweeper.GetPlayerResumByID(id);
            
            if (userResum.userType === "Connection" && userResum.photo && userResum.flag){
                this.setState({photo : userResum.photo, name : userResum.name ,flag : userResum.flag})
            }else if (userResum.userType === "Anonyme"){
                this.setState({name : userResum.name})
            }
        }

    render(): React.ReactNode {
        

        const photo = (this.state.photo)?
                        <img className="boxIn" src={this.state.photo} alt={this.state.photo} />
                        :
                        null
        
        const flag = (this.state.flag)?
                        <img src={this.state.flag} alt={this.state.flag} />
                        :
                        null

        return(
            <div className="boxOut">
                {photo}
                <span>{this.state.name}</span>
                {flag}
            </div>
        )
    }
}