import React from "react";

import { useParams, useNavigate, useLocation, NavigateFunction, Location, Params } from 'react-router-dom';

import "../../extension/extensionListe"


import Board from "../../compenent/Board";
import Room from "../../compenent/Room";
import WebsocketGame from "../../server/WebsocketGame";
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
    playersId: number[]
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

export class GameManager extends React.Component<MyProps, MyState> {

    client: WebsocketGame;
    roomRef: React.RefObject<Room | null>;
    boardRef: React.RefObject<Board | null>;
    playerListGameRef: React.RefObject<PlayersListGame | null>;


    constructor(props: MyProps) {
        super(props)

        this.setGameStatus = this.setGameStatus.bind(this);
        this.updateGameStatus = this.updateGameStatus.bind(this);
        this.updateTiles = this.updateTiles.bind(this);
        this.addCptTiles = this.addCptTiles.bind(this);
        this.setFlag = this.setFlag.bind(this);
        this.remouveFlag = this.remouveFlag.bind(this);
        this.setPlayersList = this.setPlayersList.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.sendUpdateStateGame = this.sendUpdateStateGame.bind(this);

        this.sendStartGame = this.sendStartGame.bind(this)
        this.initGameBoard = this.initGameBoard.bind(this)
        this.gameOver = this.gameOver.bind(this)

        this.sendSetFlag = this.sendSetFlag.bind(this);
        this.sendRemouveFlag = this.sendRemouveFlag.bind(this);
        this.sendDiscoverTile = this.sendDiscoverTile.bind(this);


        this.roomRef = React.createRef<Room>();
        this.boardRef = React.createRef<Board>();
        this.playerListGameRef = React.createRef<PlayersListGame>();

        if (props.params.path === undefined ||
            !Object.values(GameManagerPath).includes(props.params.path as GameManagerPath)
        ) {
            console.log("erreur!!!")
            this.props.navigate("/")
        }

        this.state = {
            state: null,
            playersId: []
        }


        //
        let roomid = null
        if (this.props.params.path as GameManagerPath === GameManagerPath.JoinRoom) {

            roomid = Number(this.props.params.roomId);
        }
        //

        this.client = new WebsocketGame(roomid, this
            // this.setGameStatus,
            // this.updateGameStatus,
            // this.updateTiles,
            // this.addCptTiles,
            // this.setFlag,
            // this.remouveFlag,
            // this.setPlayersList,
            // this.addPlayer,
            // this.initGameBoard,
            // this.gameOver
        )


    }

    setGameStatus(height: number, width: number, nbBomb: number, roomId: number, roomSize: number) {
        this.setState({ state: { height: height, width: width, nbBomb: nbBomb, roomId: roomId, roomSize: roomSize } })
    }

    updateGameStatus(height: number, width: number, nbBomb: number, roomSize: number) {
        if (this.state.state === null) {
            return
        }
        this.setState({ state: { height: height, width: width, nbBomb: nbBomb, roomId: this.state.state.roomId, roomSize: roomSize } })
    }

    updateTiles(tiles: { [key: number]: number }) {
        if (this.boardRef.current) {
            this.boardRef.current.updateTiles(tiles)
        }
    }

    gameOver(row: number, col: number) {
        if (this.boardRef.current) {
            this.boardRef.current.gameOver(row, col)
        }
    }

    addCptTiles(userId: number, nbTiles: number) {
        if (this.playerListGameRef.current) {
            this.playerListGameRef.current.addCptTiles(userId, nbTiles)
        }
    }

    setFlag(row: number, col: number) {
        if (this.boardRef.current) {
            this.boardRef.current.setFlag(row, col)
        }
    }
    remouveFlag(row: number, col: number) {
        if (this.boardRef.current) {
            this.boardRef.current.remouveflag(row, col)
        }
    }

    setPlayersList(playersId: number[]) {
        this.setState({ playersId: playersId })
    }

    addPlayer(playerId: number) {
        this.state.playersId.push(playerId)
        this.setState({}) //update State
    }

    remouvePlayer(playerId: number) {
        this.state.playersId.remouve(playerId)
        this.setState({}) //update State
    }

    leaveGame() {
        this.props.navigate("/")
    }

    sendStartGame() {
        this.client.sendStartGame()
    }

    sendLeaveGame() {
        this.client.sendLeaveGame()
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

    sendUpdateStateGame(height: number, width: number, nbBomb: number, roomSize: number) {
        this.client.sendUpdateStateGame(height, width, nbBomb, roomSize)
    }


    initGameBoard() {
        this.props.navigate("/game/inGame")
    }


    render(): React.ReactNode {


        const path = this.props.params.path as GameManagerPath

        let compenent = null
        let page: React.ReactNode = <div></div>

        switch (path) { // TODO faire en sorte que la room prend en change le cas host et non host
            case GameManagerPath.CreateRoom:


                compenent = <Room ref={this.roomRef} host={true} navigate={this.props.navigate} sendLeaveGame={() => this.sendLeaveGame()} sendUpdateStateGame={this.sendUpdateStateGame} startGame={this.sendStartGame} state={this.state.state} players={this.state.playersId} />
                page = <main>
                    {compenent}
                    <UserResum />
                </main>
                break
            case GameManagerPath.JoinRoom:
                compenent = <Room ref={this.roomRef} navigate={this.props.navigate} sendLeaveGame={() => this.sendLeaveGame()} startGame={this.sendStartGame} state={this.state.state} players={this.state.playersId} />
                page = <main>
                    {compenent}
                    <UserResum />
                </main>
                break
            case GameManagerPath.InGame:
                if (this.state.state !== null) {
                    compenent = <Board ref={this.boardRef}
                        sendLeaveGame={() => this.sendLeaveGame()}
                        navigate={this.props.navigate}
                        height={this.state.state.height}
                        width={this.state.state.width}
                        nbBomb={this.state.state.nbBomb}
                        sendDiscoverTile={this.sendDiscoverTile}
                        sendRemouveFlag={this.sendRemouveFlag}
                        sendSetFlag={this.sendSetFlag} />
                }

                page =
                    <main>
                        {compenent}
                        <PlayersListGame players={this.state.playersId} ref={this.playerListGameRef} />
                    </main>



        }


        return (
            page
        )
    }

}
