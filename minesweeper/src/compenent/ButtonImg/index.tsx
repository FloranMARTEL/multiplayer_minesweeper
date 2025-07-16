import React from "react";
import "./styles.css";


type MyState = {
}
type MyProps = {
    src : string
    alt : string
    onClick : () => void
}
export default class ButtonImg extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <button className="boxOut"  onClick={this.props.onClick}>
                <img src={this.props.src} alt={this.props.alt} />
            </button>
        )
    }
}