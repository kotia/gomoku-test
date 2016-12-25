import {
    fetchRooms, giveId, enterRoom, exitRoom, giveName, saveName,
    updateRoom, winGame, defeatGame, impossibleGame,
    CREATE_ROOM, CHOOSE_ROOM, MAKE_TURN, SET_NAME, SEND_EXIT_ROOM
} from "actions";

let host = location.origin.replace(/^http/, 'ws');

let socket;

export function executeListeners(store) {

    socket = io.connect(host, {
        transports: ["polling", "websocket"]
    });

    let userId = window.localStorage.userId;

    socket.on('give:id', (id) => {
        store.dispatch(giveId(id));
        window.localStorage.userId = id;
    });

    socket.on('give:name', (name) => {
        store.dispatch(giveName(name));
        store.dispatch(saveName());
    });

    socket.on('rooms:list', (rooms) => {
        store.dispatch(fetchRooms(rooms));
    });

    socket.on('room:enter', (room) => {
        store.dispatch(enterRoom(room));
    });

    socket.on('room:update', (room) => {
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

export function goMiddleware(store) {
    return next => action => {
        const result = next(action);

        if (socket) {
            switch(action.type) {
                case CREATE_ROOM:
                    socket.emit('room:create', action.isWhite);
                    break;
                case CHOOSE_ROOM:
                    console.log(action);
                    socket.emit('room:choose', action.id);
                    break;
                case MAKE_TURN:
                    socket.emit('room:makeTurn', action.id);
                    break;
                case SET_NAME:
                    socket.emit('name:set', action.name);
                    break;
                case SEND_EXIT_ROOM:
                    socket.emit('room:exit');
                    break;
            }
        }
        return result;
    }
}