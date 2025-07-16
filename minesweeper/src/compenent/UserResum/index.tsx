import React from "react";
import "./styles.css"

type MyState = {
}
type MyProps = {
}

export default class UserResum extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="boxOut userResumBox">
                <div>
                    <h2>Unknow_123</h2>                    
                </div>  
                <button className="boxOut buttonSmal">Sign in</button>
            </div>
        )
    }


}