import React, { JSX } from "react";
import { NavigateFunction } from 'react-router-dom';

import "./styles.css";

import Tile from "../Tile";

import ButtonImg from "../ButtonImg";
import ButtonSmal from "../ButtonSmal";
import Compteur from "../Compteur";
import RestartMenu from "../RestartMenu";

type MyState = {
    inGame : boolean
}
type MyProps = {
    height: number,
    width: number,
    nbBomb: number,
    timestempStart : number,
    sendDiscoverTile: (r: number, c: number) => void
    sendSetFlag: (r: number, c: number) => void
    sendRemouveFlag: (r: number, c: number) => void
    sendLeaveGame: () => void,
    navigate: NavigateFunction
}

export default class Board extends React.Component<MyProps, MyState> {

    tiles: React.RefObject<Tile | null>[][]

    compteurBombRef : React.RefObject<Compteur | null>;
    compteurTempsRef : React.RefObject<Compteur | null>;

    constructor(props: MyProps) {
        super(props);

        this.state = {inGame : true}

        this.compteurBombRef = React.createRef<Compteur>();
        this.compteurTempsRef = React.createRef<Compteur>();
        //generate grid
        this.tiles = []
        for (let l = 0; l < this.props.height; l++) {
            this.tiles.push([])
            for (let c = 0; c < this.props.width; c++) {
                this.tiles[l].push(React.createRef<Tile>())
            }
        }

        this.updateCompteurTemps()
    }

    updateTiles(tilesdict: { [key: number]: number }) {
        
        for (const indextile in tilesdict) {
            const indexTileNumber = Number(indextile)
            const row = Math.floor(indexTileNumber / this.props.width)
            const col = indexTileNumber % this.props.width
            const tileref = this.tiles[row][col]
            if (tileref.current) {
                tileref.current.updateValue(tilesdict[indextile])
            }
        }
    }

    gameOver(row: number, col: number) {
        const tileref = this.tiles[row][col]
        if (tileref.current) {
            tileref.current.setBomb()
        }
        this.gameDone()
    }

    gameDone(){
        this.setState({inGame : false})
    }

    setFlag(row: number, col: number) {
        
        if (this.compteurBombRef.current){
            this.compteurBombRef.current.decrement()
        }
        
        const tileref = this.tiles[row][col]

        if (tileref.current) {
            tileref.current.setFlag()
        }
    }


    remouveflag(row: number, col: number) {
        if (this.compteurBombRef.current){
            this.compteurBombRef.current.increment()
        }

        const tileref = this.tiles[row][col]
        if (tileref.current) {
            tileref.current.remouveFlag()
        }
    }

    buttonLeaveGame() {
        this.setState({inGame:false})
        this.props.sendLeaveGame()
        this.props.navigate("/")
    }

    async updateCompteurTemps(){
        while(this.state.inGame){
            if (this.compteurTempsRef.current){
                this.compteurTempsRef.current.increment()
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    render() {


        const rows = [];
        for (let l = 0; l < this.props.height; l++) {
            const columne: JSX.Element[] = [];

            for (let c = 0; c < this.props.width; c++) {
                columne.push(
                    <Tile ref={this.tiles[l][c]}
                        key={c}
                        sendDiscoverTile={() => this.props.sendDiscoverTile(l, c)}
                        sendSetFlag={() => this.props.sendSetFlag(l, c)}
                        sendRemouveFlag={() => this.props.sendRemouveFlag(l, c)}
                    />
                );
            }

            rows.push(
                <div key={l}> {columne} </div>
            );
        }


        const restartMenu = (this.state.inGame === false)?
                <RestartMenu  sendRestart={()=>console.log("Work In Progress")} goHome={() => this.props.navigate("/")}/>
                :
                <ButtonSmal onClick={() => this.buttonLeaveGame()} text="leave" />

        

        return (
            <div>
                <div className="boxOut boardBox">
                    <div className="boxIn headBoard">
                        <Compteur ref={this.compteurBombRef} valueinit={this.props.nbBomb} />
                        <ButtonImg src="/icon/smileYellow.png" alt="smile yellow" onClick={() => console.log("TODO")} />
                        <Compteur ref={this.compteurTempsRef} valueinit={Math.floor((Date.now() - this.props.timestempStart)/1000)}/>
                    </div>
                    <div className="boxIn board">
                        {rows}
                    </div>

                </div>
                
                {restartMenu}
            </div>
        );

    }
}