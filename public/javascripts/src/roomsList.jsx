"use strict";
import * as React from "react";
import {createRoom, chooseRoom} from "actions";

export class RoomsListContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <CreateRoomButtons/>
                <RoomsList rooms={this.props.rooms}/>
            </div>

        );
    }
}

class CreateRoomButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    createRoom(isWhite) {
        createRoom(isWhite);
    }

    render() {
        return (
            <div className="create-room-buttons">
                <button onClick={this.createRoom.bind(this, true)}>Create room with you as White!</button>
                <button onClick={this.createRoom.bind(this, false)}>Create room with you as Black!</button>
            </div>
        );
    }
}

class RoomsList extends React.Component {
    constructor(props) {
        super(props);
    }

    chooseRoom(id) {
        chooseRoom(id);
    }

    render() {
        return (
            <div className="rooms-list">
                {this.props.rooms.map((room, index) => {
                    return(
                        <div className="rooms-list__room"
                             onClick={this.chooseRoom.bind(this, room.id)}
                             key={index}
                        >
                            {room.creatorName || room.id}: {'You play ' + (room.isYouWhite ? 'white' : 'black')}
                        </div>
                    );
                })}
            </div>
        );
    }
}