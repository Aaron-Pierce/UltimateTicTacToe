
let incompleteBoard = Array.from(document.getElementsByClassName("square"));

let player = true; //X is first

class Square {
    constructor() {
        this.values = new Array(9);
        this.active = true;
        this.won = false;
        this.winner = true;

    }
}

function updateSquares() {
    for (square of Array.from(document.getElementsByClassName("square"))) {
        console.log(square.id)
        if (square.id !== "") {
            if (board.squares[parseInt(square.id.substr(0, 1))].values[parseInt(square.id.substr(1, 1))] !== undefined) {
                square.innerHTML = board.squares[parseInt(square.id.substr(0, 1))].values[parseInt(square.id.substr(1, 1))]
            }

        }
    }
}

function win(){
    alert(getPlayer() + " wins")
}

function checkWinCondition(squareId){
    let target = board.squares[squareId].values;
    if(target[0] === target[1] && target[1] === target[2] && target[1] !== undefined){
        return true
    }
    if(target[3] === target[4] && target[4] === target[5] && target[5] !== undefined){
        return true;
    }
    if(target[6] === target[7] && target[7] === target[8] && target[8] !== undefined){
        return true;
    }
    if(target[0] === target[4] && target[4] === target[8] && target[8] !== undefined){
        return true;
    }
    if(target[2] === target[4] && target[4] === target[6] && target[6] !== undefined){
        return true;
    }

}


function getPlayer() {
    if (player) {
        return "X"
    }
    return "O"
}

function setActive(squareId) {
    for (square in board.squares) {
        board.squares[square].active = false;
        console.log(square + "= " + squareId)
        if (squareId == square) {
            board.squares[square].active = true;
            console.log("set square " + squareId + " to active")
        }
    }
}

let board = {
    squares: [
        new Square(),
        new Square(),
        new Square(),
        new Square(),
        new Square(),
        new Square(),
        new Square(),
        new Square(),
        new Square(),
    ]
}


for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        incompleteBoard[i].innerHTML += `<div class="square s${j + 1}" id="${i}${j}"></div>`;
    }
    incompleteBoard[i].innerHTML = "<div class='subBoardWrapper'>" + incompleteBoard[i].innerHTML + "</div>"
}

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        document.getElementById(`${i}${j}`).addEventListener("click", function (e) {
            console.log("click")
            console.log("clicked " + i)
            if(board.squares[i].values[j] === undefined && board.squares[i].active){
                board.squares[i].values[j] = getPlayer();
                updateSquares();
                setActive(j);
                if(checkWinCondition(i)){
                    board.squares[i].won = true;
                }
                player = !player;
            }
        })
    }
}