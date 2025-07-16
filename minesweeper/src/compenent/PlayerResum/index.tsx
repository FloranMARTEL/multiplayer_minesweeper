import React from "react"

type MyState = {
}
type MyProps = {
    photo : string,
    name : string,
    flag : string
}
export default class PlayerResum extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        

        return(
            <div className="boxOut">
                <img className="boxIn" src={this.props.photo} alt={this.props.photo} />
                <span>{this.props.name}</span>
                <img src={this.props.flag} alt={this.props.flag} />
            </div>
        )
    }
}