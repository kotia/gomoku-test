"use strict";
import * as React from "react";
import {makeTurn, sendExitRoom} from "actions";

export class Room extends React.Component {
    constructor(props) {
        super(props);
    }

    exitRoom() {
        sendExitRoom();
    }

    render() {
        // rows = [[cell1, cell2...cell15], [cell16...cell30]...]
        let rows = this.props.room.table.reduce((acc, val, index)=>{
            if (!acc) {
                acc = []
            }
            if (index%15 === 0) {
                acc.push([]);
            }
            acc[acc.length-1].push(val);
            return acc;
        }, []);
        let userIsCreator = this.props.user.userId === this.props.room.creatorId;
        let userIsWhite = userIsCreator === this.props.room.creatorIsWhite;
        let isUserTurn = userIsWhite === this.props.room.isWhiteTurn;

        return (
            <div className="gomoku-container">
                <div className="gomoku-container__table">
                    {rows.map((cells, index)=> (
                        <GomokuTableRow cells={cells} key={index} />
                    ))}
                </div>
                <div className="gomoku-container__info">
                    <button onClick={this.exitRoom}>Exit this room!</button>
                    <br/>
                    {'Your color is ' + (userIsWhite ? 'white' : 'black')}
                    <br/>
                    {'Creator name: ' + this.props.room.creatorName}
                    <br/>
                    {this.props.room.started ?
                        ("Opponent name: " + this.props.room.opponentName) :
                        ""
                    }
                    <br />
                    {this.props.room.started ?
                        (isUserTurn ? "Now it's your turn" : "waiting for opponents turn") :
                        "Waiting for someone to connect"
                    }
                    <br />
                    {this.props.room.isWin ? <span style={{color:'green'}}>You are winner!</span> : ''}
                    {this.props.room.isDefeat ? <span style={{color:'red'}}>Sorry, you lost!</span> : ''}
                    {this.props.room.isImpossible ? <span style={{color:'red'}}>Sorry, no one won!</span> : ''}
                </div>
            </div>
        )
    }
}

class GomokuTableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    makeTurn(id) {
        makeTurn(id);
    }

    render() {
        return (
            <div className="gomoku-container__row">
                {this.props.cells.map((cell, index) =>
                    (<div onClick={this.makeTurn.bind(this, cell.id)} key={index} className="gomoku-container__row__cell">
                        <div className={
                            'gomoku-container__row__cell__circle ' +
                            (cell.isEmpty ? '' : (cell.isWhite ? 'white' : 'black'))
                        }></div>
                    </div>)
                )}
            </div>
        )
    }
}