import React from "react"

type MyState = {
    host: boolean
    height: number | null,
    width: number | null,
    nbBomb: number | null,
    roomId: number | null,
    roomSize: number | null,
}

type MyProps = {
    host?: boolean,
}

export default class Room extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)

        const tempstate = {
            height: null,
            width: null,
            nbBomb: null,
            roomId: null,
            roomSize: null
        }

        if (this.props.host) {
            this.state = { host: true, ...tempstate }
        } else {
            this.state = { host: false, ...tempstate }
        }


    }

    setGameStatus(height: number, width: number, nbBomb: number, roomId: number, roomSize: number) {
        this.setState({ height: height, width: width, nbBomb: nbBomb, roomId: roomId, roomSize: roomSize })
    }

    updateplayerlist(idPlayers : number[]){
        console.log("todo",idPlayers)
    }

    startGame() {
        console.log("Start Game")
    }

    render() {


        let startGameButton = null

        if (this.state.host) {
            startGameButton = <button onClick={() => this.startGame()}>Start Game</button>
        }

        let gamestatus = null
        if (this.state.height !== null) {
            gamestatus =
                <div>
                    <span>Height {this.state.height}</span>
                    <span>Width {this.state.width}</span>
                    <span>nbBomb {this.state.nbBomb}</span>
                    <span>roomId {this.state.roomId}</span>
                    <span>roomSize {this.state.roomSize}</span>
                </div>
        }

        return (
            <div>
                {gamestatus}
                <section>
                    <div>
                        player
                    </div>
                </section>

                {startGameButton}
            </div>
        )
    }

}
