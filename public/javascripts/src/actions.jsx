export const FETCH_ROOMS = "FETCH_ROOMS";
export const ENTER_ROOM = "ENTER_ROOM";
export const EXIT_ROOM = "EXIT_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";
export const GAME_WIN = "GAME_WIN";
export const GAME_DEFEAT = "GAME_DEFEAT";
export const GAME_IMPOSSIBLE = "GAME_IMPOSSIBLE";

export const GIVE_ID = "GIVE_ID";
export const GIVE_NAME = "GIVE_NAME";
export const SAVE_NAME = "SAVE_NAME";

export const CREATE_ROOM = Symbol();
export const CHOOSE_ROOM = Symbol();
export const MAKE_TURN = Symbol();
export const SET_NAME = Symbol();
export const SEND_EXIT_ROOM = Symbol();

export function fetchRooms(rooms) {
    return {
        type: FETCH_ROOMS,
        rooms
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
        name
    }
}

export function saveName() {
    return {
        type: SAVE_NAME
    }
}

export function enterRoom(room) {
    return {
        type: ENTER_ROOM,
        room
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
        room
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
    return {
        type: CREATE_ROOM,
        isWhite
    };
}

export function chooseRoom(id) {
    return {
        type: CHOOSE_ROOM,
        id
    };
}

export function makeTurn(id) {
    return {
        type: MAKE_TURN,
        id
    };
}

export function setName(name) {
    return {
        type: SET_NAME,
        name
    };
}

export function sendExitRoom() {
    return {
        type: SEND_EXIT_ROOM
    };
}



