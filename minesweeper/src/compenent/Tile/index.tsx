import React from "react";


type MyState = {
    value: null | number,
    status: TypeTile
}
type MyProps = {
    sendDiscoverTile: () => void
    sendSetFlag: () => void
    sendRemouveFlag: () => void
}

enum TypeTile {
    Hide,
    Flag,
    Bomb,
    Show
}

enum Typeclick {
  left = 0,
  middle=  1,
  right = 2,
};

export default class Tile extends React.Component<MyProps, MyState> {


    constructor(props: MyProps) {
        super(props);

        this.state = { status: TypeTile.Hide, value: null }
    }

    updateValue(value: number) {
        this.setState({ status: TypeTile.Show, value: value })
    }
    setFlag(){
        this.setState({status : TypeTile.Flag})
    }
    remouveFlag(){
        this.setState({status : TypeTile.Hide})
    }
    setBomb(){
        this.setState({status: TypeTile.Bomb})
    }

    leftClick(){
        if (this.state.status === TypeTile.Hide){
            this.props.sendDiscoverTile()
        }
    }

    rightclick(event : React.MouseEvent<HTMLDivElement>){
        event.preventDefault();
        if (event.button === Typeclick.right){
            if (this.state.status === TypeTile.Hide){
                this.props.sendSetFlag()
            }
            else if(this.state.status === TypeTile.Flag){
                this.props.sendRemouveFlag()
            }
        }
    }


    render(): React.ReactNode {
        const path_img = "/tileFont/default/tile/";
        let img = null
        let classname = "";
        let src = null


        if (this.state.status === TypeTile.Show){
            classname += "show";
            if (this.state.value != null &&
                this.state.value > 0){
                    src = path_img + this.state.value.toString() + ".png"
                }
        }
        else if (this.state.status === TypeTile.Flag){
            src = path_img + "flag.png"
        }
        else if (this.state.status === TypeTile.Bomb){
            src = path_img + "bomb.png"
        }

        if (src){
            img = <img src={src} alt={src} />
        }

        return (
            <div className={classname} onClick={() => this.leftClick()} onContextMenu={(e) => this.rightclick(e)}>
                {img}
            </div>
        )
    }

}
