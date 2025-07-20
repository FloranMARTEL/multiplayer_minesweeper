import path from "path";
import React,{JSX} from "react";

import { useParams, useNavigate, useLocation, NavigateFunction, Location, Params } from 'react-router-dom';



import Board from "../../compenent/Board";
import Room from "../../compenent/Room";
import WebsocketGame from "../../server/WebsocketGame";
import ButtonSmal from "../../compenent/ButtonSmal";
import UserResum from "../../compenent/UserResum";
import PlayersListGame from "../../compenent/PlayersListGame";

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
    state: null | { // déplacer se si dans le game manager
        height: number,
        width: number,
        nbBomb: number,
        roomId: number,
        roomSize: number
    },
    players: { name: string, flag: string }[]
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
    boardRef: React.RefObject<Board | null>;


    constructor(props: MyProps) {
        super(props)

        this.setGameStatus = this.setGameStatus.bind(this);
        this.updateTiles = this.updateTiles.bind(this);
        this.setFlag = this.setFlag.bind(this);
        this.remouveFlag = this.remouveFlag.bind(this);
        this.setPlayersList = this.setPlayersList.bind(this);
        this.addPlayer = this.addPlayer.bind(this);

        this.sendStartGame = this.sendStartGame.bind(this)
        this.initGameBoard = this.initGameBoard.bind(this)

        this.sendSetFlag = this.sendSetFlag.bind(this);
        this.sendRemouveFlag = this.sendRemouveFlag.bind(this);
        this.sendDiscoverTile = this.sendDiscoverTile.bind(this);


        this.roomRef = React.createRef<Room>();
        this.boardRef = React.createRef<Board>();

        if (props.params.path === undefined ||
            !Object.values(GameManagerPath).includes(props.params.path as GameManagerPath)
        ) {
            console.log("erreur!!!")
            this.props.navigate("/")
        }

        this.state = {
            state: null,
            players: []
        }


        //
        let roomid = null
        if (this.props.params.path as GameManagerPath === GameManagerPath.JoinRoom) {
            roomid = 1;
        }
        //

        this.client = new WebsocketGame(roomid,
            this.setGameStatus,
            this.updateTiles,
            this.setFlag,
            this.remouveFlag,
            this.setPlayersList,
            this.addPlayer,
            this.initGameBoard,
        )


    }

    setGameStatus(height: number, width: number, nbBomb: number, roomId: number, roomSize: number) {
        this.setState({ state: { height: height, width: width, nbBomb: nbBomb, roomId: roomId, roomSize: roomSize } })
    }

    updateplayerlist(idPlayers: number[]) {
        if (this.roomRef.current) {
            this.roomRef.current.updateplayerlist(idPlayers)
        }
    }

    updateTiles(tiles: { [key: number]: number }) {
        if(this.boardRef.current){
            this.boardRef.current.updateTiles(tiles)
        }
    }

    setFlag(row: number, col: number) {
        if (this.boardRef.current){
            this.boardRef.current.setFlag(row,col)
        }
    }
    remouveFlag(row: number, col: number) {
        if (this.boardRef.current){
            this.boardRef.current.remouveflag(row,col)
        }
    }

    setPlayersList(players: { name: string, flag: string }[]) {
        this.setState({ players: players })
    }

    addPlayer(player: { name: string; flag: string; }) {
        this.setState({ players: [...this.state.players, player] })
    }

    sendStartGame() {
        this.client.sendStartGame()
    }

    sendDiscoverTile(r: number, c: number) {
        this.client.sendDiscoverTile(r, c)
    }

    sendSetFlag(r: number, c: number) {
        this.client.sendSetFlag(r, c)
    }

    sendRemouveFlag(r: number, c: number) {
        this.client.sendRemouveFlag(r, c)
    }

    initGameBoard() {
        this.props.navigate("/game/inGame")
    }





    render(): React.ReactNode {


        const path = this.props.params.path as GameManagerPath

        let compenent = null
        let page : React.ReactNode = <div></div>

        switch (path) { // TODO faire en sorte que la room prend en change le cas host et non host
            case GameManagerPath.CreateRoom:
                compenent = <Room ref={this.roomRef} host={true} startGame={this.sendStartGame} state={this.state.state} players={this.state.players}></Room>

                page = <main>
                            <div>
                                {compenent}
                                <ButtonSmal onClick={() => console.log("test")} text="leave" />
                            </div>
                            <UserResum />
                        </main>
                break
            case GameManagerPath.JoinRoom:
                compenent = <Room ref={this.roomRef} startGame={this.sendStartGame} state={this.state.state} players={this.state.players}></Room>
                page = <main>
                            <div>
                                {compenent}
                                <ButtonSmal onClick={() => console.log("test")} text="leave" />
                            </div>
                            <UserResum />
                        </main>
                break
            case GameManagerPath.InGame:
                if (this.state.state !== null) {
                    compenent = <Board ref={this.boardRef}
                        height={this.state.state.height}
                        width={this.state.state.width}
                        nbBomb={this.state.state.nbBomb}
                        sendDiscoverTile={this.sendDiscoverTile}
                        sendRemouveFlag={this.sendRemouveFlag}
                        sendSetFlag={this.sendSetFlag} />
                }
                console.log("players : ",this.state.players)
                page = 
                <main>
                    {compenent}
                    <PlayersListGame players={this.state.players}/>
                </main>

                

        }


        return (
            page
        )
    }

}
