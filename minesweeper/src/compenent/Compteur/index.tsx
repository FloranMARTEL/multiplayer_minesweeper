import React from "react";


type MyState = {
    add : number
}
type MyProps = {
    valueinit: number
}
export default class Compteur extends React.Component<MyProps, MyState> {


    constructor(prop : MyProps){
        super(prop)
        this.state = {add : 0}
    }
    
    increment(){
        this.setState({add : this.state.add + 1})
    }

    decrement(){
        this.setState({add : this.state.add - 1})
    }

    render(): React.ReactNode {


        const val = this.props.valueinit + this.state.add

        const stringValue = (val < 999)?('000'+val).slice(-3):"999";
        const d1 = `\\tileFont\\default\\digit\\d${stringValue[0]}.svg`
        const d2 = `\\tileFont\\default\\digit\\d${stringValue[1]}.svg`
        const d3 = `\\tileFont\\default\\digit\\d${stringValue[2]}.svg`

        return (
            <div className="boxIn">
                <img src={d1} alt="compteur" />
                <img src={d2} alt="compteur" />
                <img src={d3} alt="compteur" />
            </div>
        )
    }
}
