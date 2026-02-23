import React from 'react';
import Button from '../Button';

import "./styles.css"

type MyState = {
}
type MyProps = {
    sendRestart : ()=>void,
    goHome : ()=>void 
}
export default class RestartMenu extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props);
    }

    render(): React.ReactNode {
        
        return (
            <div className='boxOut restartMenu'>
                <div className='boxIn'><h2>Game Over</h2></div>
                <div>
                    <Button onClick={this.props.sendRestart} text='Restart'/>
                    <Button onClick={this.props.goHome} text={"Home"}/>
                </div>
            </div>
        )
    }
}