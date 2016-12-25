import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from 'react-redux';

import {store} from "store";
import {setName, giveName, sendExitRoom, createRoom, makeTurn, chooseRoom} from "actions";

import {RoomsListContainer as RoomsList} from "./roomsList";
import {Room} from "./room";
import {executeListeners} from "./socket";


class IndexContainer extends React.Component {
    constructor(props){
        super(props);

        this.actions = {
            setName: this.setName.bind(this),
            handleChange: this.handleChange.bind(this),
            exitRoom: this.exitRoom.bind(this),
            makeTurn: this.makeTurn.bind(this),
            createRoom: this.createRoom.bind(this),
            chooseRoom: this.chooseRoom.bind(this)
        }
    }

    componentDidMount(){
        executeListeners(store);
    }

    setName() {
        this.props.onSetName(this.props.user.name);
    }

    handleChange(e) {
        this.props.onGiveName(e.target.value);
    }

    exitRoom() {
        this.props.onExitRoom();
    }

    makeTurn(e) {
        this.props.onMakeTurn(e.currentTarget.dataset.cell);
    }

    createRoom(e) {
        let isWhite = e.currentTarget.dataset.color == 'white';
        this.props.onCreateRoom(isWhite);
    }

    chooseRoom(e) {
        let id = e.currentTarget.dataset.id;
        this.props.onChooseRoom(id);
    }

    render(){
        return (
            <Index
                actions={this.actions}
                user={this.props.user}
                room={this.props.room}
                rooms={this.props.rooms} />
        )
    }
}

class Index extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let container = this.props.room.table ?
            <Room actions={this.props.actions} user={this.props.user} room={this.props.room} /> :
            <RoomsList actions={this.props.actions} rooms={this.props.rooms} />;
        let nameElement = this.props.user.name && this.props.user.nameSaved ?
            (
                <div>Your name is {this.props.user.name}</div>
            ):(
                <div>
                    What is you name?
                    <input type="text" value={this.props.user.name} onChange={this.props.actions.handleChange} />
                    <button onClick={this.props.actions.setName}>Save name!</button>
                </div>
        );

        return (
            <div>
                <div className="userinfo-container">
                    You user ID is {this.props.user.userId}.
                    {nameElement}
                </div>
                {container}
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
        rooms: store.rooms,
        room: store.room,
        user: store.user
});

const mapDispatchToProps = (dispatch) => ({
    onGiveName(name) {
        dispatch(giveName(name));
    },
    onSetName(name) {
        dispatch(setName(name));
    },
    onExitRoom() {
        dispatch(sendExitRoom());
    },
    onMakeTurn(id) {
        dispatch(makeTurn(id));
    },
    onCreateRoom(isWhite) {
        dispatch(createRoom(isWhite));
    },
    onChooseRoom(id) {
        dispatch(chooseRoom(id));
    }
});

const MainContainer = connect(mapStateToProps, mapDispatchToProps)(IndexContainer);


export function start() {

    ReactDOM.render(
        <Provider store={store}>
            <MainContainer />
        </Provider>,
        document.getElementById('app')
    );
}