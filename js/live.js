let socket = io();

let roomCode = window.location.search.replace("?", "");
socket.emit("joinRoom", roomCode)
document.getElementById("room").innerHTML = roomCode

let player = "spectator";

socket.on("playerValue", function(roomCheck, value){
    if(roomCheck === roomCode){
        player = value;
        document.getElementById("you").innerHTML = value;
    }
});

let incompleteBoard = Array.from(document.getElementsByClassName("square")); //populate board with subboards
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        incompleteBoard[i].innerHTML += `<div class="square s${j + 1}" id="${i}${j}"></div>`;
    }
    incompleteBoard[i].innerHTML = "<div class='subBoardWrapper'>" + incompleteBoard[i].innerHTML + "</div>"
}

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        document.getElementById(`${i}${j}`).addEventListener("click", function (e) {
            console.log("clicked squaure" + i + j)
            socket.emit("click", roomCode, [i,j])
        })
    }
}


function updateSquares() {
    for (square of Array.from(document.getElementsByClassName("square"))) {
        console.log(square)
        if (square.id !== "") {
            if (board.squares[parseInt(square.id.substr(0, 1))].values[parseInt(square.id.substr(1, 1))] !== undefined && board.squares[parseInt(square.id.substr(0, 1))].won !== true) {
                square.innerHTML = board.squares[parseInt(square.id.substr(0, 1))].values[parseInt(square.id.substr(1, 1))]

            }
        }
    }
    for(let i = 0; i < 9; i++){
        if(board.squares[i].active){
            document.getElementsByClassName(`largeSquare`)[i].classList.add("active")
        }else{
            document.getElementsByClassName(`largeSquare`)[i].classList.remove("active")
        }

        if(board.squares[i].won){
            document.getElementsByClassName('largeSquare')[i].innerHTML = board.squares[i].winner
        }
    }
}

socket.on("update", function(roomCheck, data){
    if(roomCode === roomCheck){
        board = data;
        document.getElementById("player").innerHTML = board.turn
        updateSquares();
    }
})

socket.on("won", function(roomTag, winner){
    if(roomTag === roomCode){
        alert(`${winner} wins!`)
    }
})

window.addEventListener("beforeunload", function(e){
    socket.emit("leave", roomCode)
 }, false);
