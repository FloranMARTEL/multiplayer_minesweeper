import React from "react";


type MyState = {
    value: null | number,
    status: TypeTile
}
type MyProps = {
    onClick: () => void
}

enum TypeTile {
    Hide,
    Flag,
    Show
}

export default class Board extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);

        this.state = { status: TypeTile.Hide, value: null }
    }

    updateValue(value: number) {

        this.setState({ status: TypeTile.Show, value: value })

    }


    render(): React.ReactNode {
        const path_img = "cellfont/default/";
        let img = null
        let classname;
        let src = null


        if (this.state.status === TypeTile.Hide){
            classname = ""
        }else{
            classname = "show"
            
            if (this.state.status === TypeTile.Show &&
                this.state.value != null &&
                this.state.value > 0){
                    src = path_img + this.state.value.toString() + ".png"
                }
            else if (this.state.status === TypeTile.Flag){
                src = path_img + "flag.png"
            }
        }

        if (src){
            img = <img src={src} alt={src} />
        }

        return (
            <div className={classname} onClick={() => this.props.onClick()}>
                {img}
            </div>
        )
    }

}
