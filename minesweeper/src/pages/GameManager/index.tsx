import path from "path";
import React from "react";

import { useParams, useNavigate, useLocation, NavigateFunction, Location, Params } from 'react-router-dom';


import Board from "../../compenent/Board";
import Room from "../../compenent/Room";
import WebsocketGame from "../../server/WebsocketGame";
import { NumericLiteral } from "typescript";


export default function GameManagerWrapper() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <GameManager
            params={params}
            navigate={navigate}
            location={location}
        />
    );
}

type MyState = {
    path: GameManagerPath
}
type MyProps = {
    params: Readonly<Params<string>>;
    navigate: NavigateFunction;
    location: Location;
}

enum GameManagerPath {
    CreateRoom = "createRoom",
    JoinRoom = "joinRoom",
    InGame = "inGame"
}

class GameManager extends React.Component<MyProps, MyState> {

    client: WebsocketGame;
    roomRef: React.RefObject<Room | null>;


    constructor(props: MyProps) {
        super(props)

        this.setGameStatus = this.setGameStatus.bind(this);
        this.updateTiles = this.updateTiles.bind(this);
        this.setflag = this.setflag.bind(this);
        this.remouveflag = this.remouveflag.bind(this);

        this.roomRef = React.createRef<Room>();

        if (props.params.path === undefined ||
            !Object.values(GameManagerPath).includes(props.params.path as GameManagerPath)
        ) {
            console.log("erreur!!!")
            this.props.navigate("/")
        }

        this.state = {
            path: props.params.path as GameManagerPath
        }


        //
        let roomid = null
        if (this.state.path === GameManagerPath.JoinRoom) {
            roomid = 1;
        }
        //

        this.client = new WebsocketGame(roomid,
            this.setGameStatus,
            this.updateTiles,
            this.setflag,
            this.remouveflag
        )


    }

    setGameStatus(height: number, width: number, nbBomb: number, roomID: number, roomSize: number) {
        if (this.roomRef.current) {
            this.roomRef.current.setGameStatus(height, width, nbBomb, roomID, roomSize)
        }
    }

    updateplayerlist(idPlayers : number[]){
         if (this.roomRef.current) {
            this.roomRef.current.updateplayerlist(idPlayers)
        }
    }

    updateTiles(tiles: { [key: number]: number }) {
        console.log("TODO updateTiles")
    }

    setflag(row: number, col: number) {
        console.log("todo")
    }
    remouveflag(row: number, col: number) {
        console.log("todo")
    }





    render(): React.ReactNode {


        let compenent = null

        switch (this.state.path) {
            case GameManagerPath.CreateRoom:
                compenent = <Room ref={this.roomRef} host={true}></Room>
                break
            case GameManagerPath.JoinRoom:
                compenent = <Room ref={this.roomRef} host></Room>
                break
            case GameManagerPath.InGame:
                compenent = null

        }


        return (
            <div>
                {this.state.path}

                {compenent}

                <button onClick={() => this.props.navigate("/game/page2")}>click</button>
            </div>
        )
    }

}
