
import React, { JSX } from "react"


type MyState = {
}

type MyProps = {
    photo: string,
    name: string,
    flag: string
}

export default class PlayerResumState extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)
    }


    render(): React.ReactNode {


        return (
            <div className="boxOut playerResumStat">
                <img className="boxIn" src={this.props.photo} alt={this.props.photo} />
                <div>
                    <div>
                        <span>{this.props.name}</span>
                        <img src={this.props.flag} alt={this.props.flag} />
                    </div>
                    <div>
                        <span>Discovery Tiles</span>
                        <span>0</span>
                    </div>
                </div>

            </div>
        )
    }


}