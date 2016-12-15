import { createStore, combineReducers } from 'redux'
import * as actionTypes from 'actions'

const roomsReducer = function(state = [], action) {
    if (action.type === actionTypes.FETCH_ROOMS) {
        return action.rooms.map((room) => {
            return {
                id: room.id,
                isYouWhite: !room.creatorIsWhite,
                creatorId: room.creatorId,
                creatorName: room.creatorName
            }
        });
    } else {
        return state;
    }
};

const roomReducer = function (state = {}, action) {
    if (action.type === actionTypes.ENTER_ROOM) {
        return {
            roomId: action.roomId,
            isWin: false,
            isDefeat: false,
            isImpossible: false,
            isFinished: false,
            table: action.room.table,
            creatorIsWhite: action.room.creatorIsWhite,
            isWhiteTurn: action.room.isWhiteTurn,
            creatorId: action.room.creatorId,
            opponentId: action.room.opponentId,
            creatorName: action.room.creatorName,
            opponentName: action.room.opponentName,
            started: action.room.started
        }
    } else if (action.type === actionTypes.UPDATE_ROOM) {
        return Object.assign({}, state, {
            table: action.room.table,
            isWhiteTurn: action.room.isWhiteTurn,
            opponentId: action.room.opponentId,
            opponentName: action.room.opponentName,
            creatorName: action.room.creatorName,
            started: action.room.started
        });
    } else if (action.type === actionTypes.GAME_WIN) {
        return Object.assign({}, state, {
            isFinished: true,
            isWin: true
        });
    } else if (action.type === actionTypes.GAME_DEFEAT) {
        return Object.assign({}, state, {
            isFinished: true,
            isDefeat: true
        });
    } else if (action.type === actionTypes.GAME_IMPOSSIBLE) {
        return Object.assign({}, state, {
            isFinished: true,
            isImpossible: true
        });
    }else if (action.type === actionTypes.EXIT_ROOM) {
        return {};
    } else {
        return state;
    }
};

const userReducer = function(state = {userId: 0, name: ""}, action){
    if (action.type === actionTypes.GIVE_ID) {
        return Object.assign({}, state, {
            userId: action.userId
        });
    } else if (action.type === actionTypes.GIVE_NAME){
        return Object.assign({}, state, {
            name: action.name
        });

    } else {
        return state;
    }
};

const reducers = combineReducers({
    rooms: roomsReducer,
    room: roomReducer,
    user: userReducer
});

export const store = createStore(reducers);