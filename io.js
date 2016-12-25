'use strict';

let io;
const gomoku = require('./gomokuLogic');
const EventEmitter = require('events');

class GoEmitter extends EventEmitter {}
const goEmitter = new GoEmitter();

module.exports.init = function(server) {
    io = server;
    let rooms = [];
    let users = [];

    const generateUserId = function(){
        if (!users.length) {
            return 0;
        } else {
            return Math.max.apply(null, users.map((user)=>user.id)) + 1;
        }
    };

    let createRoom = function(isWhite, userId) {
        let room = {
            id: rooms.length,
            creatorId: userId,
            creatorName: users.find(function(user){return userId == user.id}).name,
            opponentId: undefined,
            opponentName: '',
            creatorIsWhite: isWhite,
            creatorCanProceed: true,
            opponentCanProceed: true,
            finished: false,
            started: false,
            isWhiteTurn: false,
            table: gomoku.tableConstructor()
        };
        rooms.push(room);
        return room;
    };

    let filterRooms = function(userId){
        return rooms.filter(function(room){return !room.started && !room.finished && (room.creatorId !== userId)})
            .map(function(room) {
                return {
                    id: room.id,
                    creatorId: room.creatorId,
                    creatorName: room.creatorName,
                    creatorIsWhite: room.creatorIsWhite
                };
            });
    };

    io.on('connection', function (socket) {
        let room;
        let user;

        socket.on('page:loaded', function(receivedId) {
            if (receivedId === 'no' || !users.find(function(user){return !user.isActive && receivedId == user.id})) {
                user = {
                    id: generateUserId(),
                    name: "",
                    isWhite: false,
                    isPlaying: false,
                    possibleToProceed: true,
                    isActive: true
                };
                users.push(user);
                socket.emit('give:id', user.id);
            } else {
                user = users.find((user) => receivedId == user.id);
                room = rooms.find((room) => room.creatorId == user.id || room.opponentId == user.id);
                socket.emit('give:id', user.id);
                if (user.name) {
                    socket.emit('give:name', user.name);
                }

                if (room && !room.finished) {
                    socket.emit('room:enter', room);
                }
            }

            socket.emit('rooms:list', filterRooms(user.id));
        });

        let roomsUpdateCallback = function(){
            if (user) {
                socket.emit('rooms:list', filterRooms(user.id));
            }
        };

        goEmitter.on('rooms:update', roomsUpdateCallback);

        let roomUpdateCallback = function(roomId){
            if(room && roomId === room.id) {
                socket.emit('room:update', room);
            }
        };

        goEmitter.on('room:update', roomUpdateCallback);

        let roomVictoryCallback = function(winnerId, roomId) {
            if (room && roomId === room.id) {
                room.finished = true;
                goEmitter.emit('rooms:update');
                socket.emit('room:update', room);
                if (winnerId === user.id) {
                    socket.emit('room:victory');
                } else {
                    socket.emit('room:defeat');
                }
            }
        };

        goEmitter.on('room:victory', roomVictoryCallback);

        let roomPosibilityCallback = function(roomId){
            if (room && roomId === room.id) {
                if (user.id === room.creatorIsWhite) {
                    room.creatorCanProceed = false;
                } else {
                    room.opponentCanProceed = false;
                }
                if (!room.creatorCanProceed && !room.opponentCanProceed) {
                    room.finished = true;
                    goEmitter.emit('rooms:update');
                    socket.emit('room:update', room.id);
                    socket.emit('room:impossible');
                }
            }
        };

        goEmitter.on('room:possibility', roomPosibilityCallback);

        let roomExitCallback = function(roomId){
            if (room && room.id == roomId) {
                socket.emit('room:exit');
            }
        };

        goEmitter.on('room:exit', roomExitCallback);

        socket.on('name:set', function(name){
            user.name = name;
            socket.emit('give:name', name);
            let createdRoom = rooms.find((room)=>room.creatorId==user.id);
            let assignedRoom = rooms.find((room)=>room.opponentId==user.id);
            if (createdRoom) {
                createdRoom.creatorName = name;
                goEmitter.emit('rooms:update');
                goEmitter.emit('room:update', createdRoom.id);
            } else if (assignedRoom) {
                assignedRoom.opponentName = name;
                goEmitter.emit('room:update', assignedRoom.id);
            }
        });

        socket.on('room:create', function(isWhite) {
            room = createRoom(isWhite, user.id);
            user.isPlaying = true;
            user.isWhite = isWhite;
            goEmitter.emit('rooms:update');
            socket.emit('room:enter', room);
        });

        socket.on('room:choose', function(id) {
            room = rooms.find((room) => room.id == id);
            user.isWhite = !room.creatorIsWhite;
            room.opponentId = user.id;
            room.opponentName = user.name;
            room.started = true;
            user.isPlaying = true;
            socket.emit('room:enter', room);
            goEmitter.emit('rooms:update');
            goEmitter.emit('room:update', room.id);
        });

        socket.on('room:makeTurn', function(id){
            if(user.isWhite === room.isWhiteTurn && !room.finished && room.table[id].isEmpty) {
                room.table[id].isEmpty = false;
                room.table[id].isWhite = room.isWhiteTurn;
                room.isWhiteTurn = !room.isWhiteTurn;
                goEmitter.emit('room:update', room.id);

                if (gomoku.checkVictory(room.table, id)) {
                    goEmitter.emit('room:victory', user.id, room.id);
                } else {
                    if (user.possibleToProceed) {
                        user.possibleToProceed = gomoku.checkPossibility(room.table, user.isWhite);
                    }
                    if (!user.possibleToProceed) {
                        goEmitter.emit('room:possibility', room.id);
                    }
                }
            }
        });

        socket.on('room:exit', function(){
            // if user exits from room that he hasn't created and he wasn't played in it - room will appear in list
            // else - room will hide forever
            if (!room.table.find((cell) => !cell.isEmpty) && (room.creatorId != user.id)) {
                room.started = false;
                socket.emit('room:exit');
            } else {
                room.finished = true;
                goEmitter.emit('room:exit', room.id);
            }
            goEmitter.emit('rooms:update');
        });

        socket.on('disconnect', function(n){
            goEmitter.removeListener('rooms:update', roomsUpdateCallback);
            goEmitter.removeListener('room:update', roomUpdateCallback);
            goEmitter.removeListener('room:victory', roomVictoryCallback);
            goEmitter.removeListener('room:possibility', roomPosibilityCallback);
            goEmitter.removeListener('room:exit', roomExitCallback);

            if (user) {
                user.isActive = false;
                console.log('User ' + user.id + ' disconnected');
            }
        });
    });
};