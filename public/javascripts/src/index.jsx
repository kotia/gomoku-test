import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from 'react-redux';

import {store} from "store";
import {fetchRooms, giveId, enterRoom, exitRoom, setName, giveName,
    updateRoom, winGame, defeatGame, impossibleGame} from "actions";

import {RoomsListContainer as RoomsList} from "./roomsList";
import {Room} from "./room";
import {socket} from "./socket";


class IndexContainer extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        let userId = window.localStorage.userId;

        socket.on('give:id', (id) => {
            store.dispatch(giveId(id));
            window.localStorage.userId = id;
        });

        socket.on('give:name', (name) => {
            store.dispatch(giveName(name));
        });

        socket.on('rooms:list', (rooms) => {
            store.dispatch(fetchRooms(rooms));
        });

        socket.on('room:enter', (room) => {
            store.dispatch(enterRoom(room));
        });

        socket.on('room:update', (room) => {
            console.log(room.creatorName);
            console.log(room.opponentName);
            console.log('--||--');
            store.dispatch(updateRoom(room));
        });

        socket.on('room:impossible', () => {
            store.dispatch(impossibleGame());
        });

        socket.on('room:victory', () => {
            store.dispatch(winGame());
        });

        socket.on('room:defeat', () => {
            store.dispatch(defeatGame());
        });

        socket.on('room:exit', () => {
            store.dispatch(exitRoom());
        });

        socket.emit('page:loaded', userId || 'no');
    }

    render(){
        return (
            <Index user={this.props.user} room={this.props.room} rooms={this.props.rooms} />
        )
    }
}

class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.user.name
        }
    }

    handleChange(e){
        this.setState({name: e.target.value});
    }

    saveName(){
        setName(this.state.name)
    }

    render() {
        let container = this.props.room.table ?
            <Room user={this.props.user} room={this.props.room} /> :
            <RoomsList rooms={this.props.rooms} />;
        let nameElement = this.props.user.name ?
            (
                <div>Your name is {this.props.user.name}</div>
            ):(
                <div>
                    What is you name?
                    <input type="text" value={this.state.name} onChange={this.handleChange.bind(this)} />
                    <button onClick={this.saveName.bind(this)}>Save name!</button>
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

const mapStateToProps = function(store) {
    return {
        rooms: store.rooms,
        room: store.room,
        user: store.user
    };
};

const MainContainer = connect(mapStateToProps)(IndexContainer);


export function start() {

    ReactDOM.render(
        <Provider store={store}>
            <MainContainer />
        </Provider>,
        document.getElementById('app')
    );
}