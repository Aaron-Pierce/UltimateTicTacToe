var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(require('express').static("./"))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


class Square {
    constructor(num) {
        this.values = new Array(9);
        this.active = true;
        this.won = false;
        this.winner = ""
        this.set = (squareNumber, value) => {
            let targetSquare = this.values[squareNumber];
            if (this.values[squareNumber] == undefined && this.active) {
                this.values[squareNumber] = value;
                return true;
            }
            return false;
        }

    }
}

function setActive(room, largeSquare) {
    let targetWon = rooms[room].squares[largeSquare].won;
    if (targetWon) {
        for (square in rooms[room].squares) {
            rooms[room].squares[square].active = true;
        }
    } else {
        for (square in rooms[room].squares) {
            rooms[room].squares[square].active = false;
            if (largeSquare == square) {
                rooms[room].squares[square].active = true;
            }
        }
    }
}


let rooms = {

}

function getPlayer(room, id) {
    console.log(room.players)
    console.log(id)
    if (room.players.indexOf(id) === 0) {
        return "X"
    }else if (room.players.indexOf(id) === 1) {
        return "O"
    }
}

function checkPlayerWin(room) {
    let target = rooms[room].squares;
    let wintriplets = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (triplet of wintriplets) {
        if (target[triplet[0]].won && target[triplet[1]].won && target[triplet[2]].won && target[triplet[0]].winner === target[triplet[1]].winner && target[triplet[1]].winner === target[triplet[2]].winner) { //top horizontal
            io.emit("won", room, rooms[room].turn)
        }
    }

}

function checkWinCondition(room, squareId){
    let target = room.squares[squareId].values;
    let wintriplets = [[0,1,2], [3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(triplet of wintriplets){
        if(target[triplet[0]] === target[triplet[1]] && target[triplet[1]] === target[triplet[2]] && target[triplet[1]] !== undefined){
            room.squares[squareId].won = true;
            room.squares[squareId].winner = room.turn
            return true;
        }
    }
}

function createRoom(code){
    rooms[code.toLowerCase()] = {
        squares: [
            new Square(1),
            new Square(2),
            new Square(3),
            new Square(4),
            new Square(5),
            new Square(6),
            new Square(7),
            new Square(8),
            new Square(9),
        ],
        players: [],
        turn: "X"
    }

    console.log(`created room ${code}`)
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on("newRoom", function (code) {
        createRoom(code);
    })


    function verifyPlayer(room, turn, id) {
        if (turn === "X" && room.players[0] === id) {
            return true;
        } else if (turn === "O" && room.players[1] === id) {
            return true;
        }
        return false;
    }


    socket.on("joinRoom", function (roomId) {
        if(rooms[roomId] === undefined){
            createRoom(roomId)
        }
        console.log(`${socket.id} has joined the room among ${rooms[roomId].players}`)

        rooms[roomId].players.push(socket.id);
        console.log(rooms[roomId].players)
        if (rooms[roomId].players.length === 1) {
            socket.emit("playerValue", roomId, "X");
        } else if (rooms[roomId].players.length === 2) {
            socket.emit("playerValue", roomId, "O");
        } else {
            socket.emit("playerValue", roomId, "spectator")
        }
        io.emit("update", roomId, rooms[roomId]);
    });

    socket.on("click", function (roomCode, coords) {
        if (verifyPlayer(rooms[roomCode], rooms[roomCode].turn, socket.id)) {
            let targetRoom = rooms[roomCode]
            console.log("recieved Click")
            if (targetRoom.squares[coords[0]].set(coords[1], targetRoom.turn)) { //if successfully set

                if(checkWinCondition(rooms[roomCode], coords[0])){
                    checkPlayerWin(roomCode);
                }
                if (targetRoom.turn === "X") {
                    targetRoom.turn = "O"
                } else {
                    targetRoom.turn = "X"
                }

                setActive(roomCode, coords[1])

                io.emit("update", roomCode, targetRoom);
            } else {
                console.log("tried to click filled square")
            }
        }
    });

    socket.on("leave", function(roomCode){
        if(rooms[roomCode] !== undefined){
            console.log("someone left, updating....")
            let targetRoom = rooms[roomCode];
            targetRoom.players.splice(targetRoom.players.indexOf(socket.id), 1);
            console.log("new list of tings:")
            console.log(targetRoom.players)
            for(playerIndex in targetRoom.players){
                console.log("playerIndex is " + playerIndex)
                console.log(playerIndex == 0)
                console.log(playerIndex === 0)
                if(playerIndex == 0){
                    console.log("player " + targetRoom.players[playerIndex] + " has been set to x")
                    io.sockets.connected[targetRoom.players[playerIndex]].emit("playerValue", roomCode, "X")
                }else if(playerIndex == 1){
                    io.sockets.connected[targetRoom.players[playerIndex]].emit("playerValue", roomCode, "O")
                    console.log("player " + targetRoom.players[playerIndex] + " has been set to o")
                }else{
                    io.sockets.connected[targetRoom.players[playerIndex]].emit("playerValue", roomCode, "spectator")
                    console.log("player " + targetRoom.players[playerIndex] + " has been set to spectator")
                }
            }
        }
    })


});

http.listen(7324, function () {
    console.log('listening on *:7324');
});