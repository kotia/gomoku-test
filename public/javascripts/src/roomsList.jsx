"use strict";
import * as React from "react";

export class RoomsListContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <CreateRoomButtons createRoom={this.props.actions.createRoom}/>
                <RoomsList chooseRoom={this.props.actions.chooseRoom} rooms={this.props.rooms}/>
            </div>

        );
    }
}

class CreateRoomButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="create-room-buttons">
                <button data-color="white" onClick={this.props.createRoom}>Create room with you as White!</button>
                <button data-color="black" onClick={this.props.createRoom}>Create room with you as Black!</button>
            </div>
        );
    }
}

class RoomsList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="rooms-list">
                {this.props.rooms.map((room, index) => {
                    return(
                        <div className="rooms-list__room"
                             onClick={this.props.chooseRoom}
                             data-id={room.id}
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