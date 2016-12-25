"use strict";
import * as React from "react";
import { connect } from 'react-redux';
import {createRoom, chooseRoom} from "actions";



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

class RoomsListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.actions = {
            createRoom: this.createRoom.bind(this),
            chooseRoom: this.chooseRoom.bind(this)
        }
    }

    createRoom(e) {
        let isWhite = e.currentTarget.dataset.color == 'white';
        this.props.onCreateRoom(isWhite);
    }

    chooseRoom(e) {
        console.log(e.currentTarget.dataset);
        let id = e.currentTarget.dataset.id;
        this.props.onChooseRoom(id);
    }

    render() {
        return (
            <div>
                <CreateRoomButtons createRoom={this.actions.createRoom}/>
                <RoomsList chooseRoom={this.actions.chooseRoom} rooms={this.props.rooms}/>
            </div>

        );
    }
}

const mapStateToProps = (store) => ({
    rooms: store.rooms
});

const mapDispatchToProps = (dispatch) => ({
    onCreateRoom(isWhite) {
        dispatch(createRoom(isWhite));
    },
    onChooseRoom(id) {
        dispatch(chooseRoom(id));
    }
});

export const ConnectedRoomsListContainer = connect(mapStateToProps, mapDispatchToProps)(RoomsListContainer);