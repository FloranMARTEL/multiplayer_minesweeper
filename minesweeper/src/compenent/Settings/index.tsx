import React from "react";


type MyState = {
}
type MyProps = {
}

export default class Settings extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="boxOut">
                <div className="BoxIn"><h2>Settings</h2></div>
                <div className="BoxIn">
                    TODO
                </div>
            </div>
        )
    }


}