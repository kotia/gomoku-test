import {socket} from "./socket";

export const FETCH_ROOMS = "FETCH_ROOMS";
export const ENTER_ROOM = "ENTER_ROOM";
export const EXIT_ROOM = "EXIT_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";
export const GAME_WIN = "GAME_WIN";
export const GAME_DEFEAT = "GAME_DEFEAT";
export const GAME_IMPOSSIBLE = "GAME_IMPOSSIBLE";

export const GIVE_ID = "GIVE_ID";
export const GIVE_NAME = "GIVE_NAME";

export function fetchRooms(rooms) {
    return {
        type: FETCH_ROOMS,
        rooms: rooms
    }
}

export function giveId(id) {
    return {
        type: GIVE_ID,
        userId: id
    }
}

export function giveName(name) {
    return {
        type: GIVE_NAME,
        name: name
    }
}

export function enterRoom(room) {
    return {
        type: ENTER_ROOM,
        room: room
    }
}

export function exitRoom() {
    return {
        type: EXIT_ROOM
    }
}

export function updateRoom(room) {
    return {
        type: UPDATE_ROOM,
        room: room
    }
}

export function winGame() {
    return {
        type: GAME_WIN
    }
}

export function defeatGame() {
    return {
        type: GAME_DEFEAT
    }
}

export function impossibleGame() {
    return {
        type: GAME_IMPOSSIBLE
    }
}

export function createRoom(isWhite) {
    socket.emit('room:create', isWhite);
}

export function chooseRoom(id) {
    socket.emit('room:choose', id);
}

export function makeTurn(id) {
    socket.emit('room:makeTurn', id);
}

export function setName(name) {
    socket.emit('name:set', name);
}

export function sendExitRoom() {
    socket.emit('room:exit');
}



