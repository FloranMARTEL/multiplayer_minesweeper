import React from "react";
import "./styles.css";


type MyState = {
}
type MyProps = {
    text : string
    onClick : () => void
}
export default class Button extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <button className="boxOut"  onClick={this.props.onClick}>
                {this.props.text}
            </button>
        )
    }
}