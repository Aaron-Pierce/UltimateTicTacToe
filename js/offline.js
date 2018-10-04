
let incompleteBoard = Array.from(document.getElementsByClassName("square"));

let player = true; //X is first

class Square {
    constructor(num) {
        this.values = new Array(9);
        this.active = true;
        this.won = false;
        this.winner = true;
        this.el = document.getElementsByClassName("s" + num)[0]
        this.win = () => {
            this.won = true;
            this.el.innerHTML = `<span class='fullLetter'> ${getPlayer()} </span>`
        }

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
}

function win(){
    alert(getPlayer() + " wins")
}

function checkPlayerWin(){
    let target = board.squares;
    let wintriplets = [[0,1,2], [3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(triplet of wintriplets){
        if(target[triplet[0]].el.innerHTML === target[triplet[1]].el.innerHTML && target[triplet[1]].el.innerHTML === target[triplet[2]].el.innerHTML && target[triplet[1]].el.innerHTML.toString().indexOf("span") !== -1){//top horizontal
            for(index of triplet){
                board.squares[index].el.classList.add("won")
            }
            alert(getPlayer() + " has won!")
        }
    }

}

function checkWinCondition(squareId){
    let target = board.squares[squareId].values;
    let wintriplets = [[0,1,2], [3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(triplet of wintriplets){
        if(target[triplet[0]] === target[triplet[1]] && target[triplet[1]] === target[triplet[2]] && target[triplet[1]] !== undefined){
            return true;
        }
    }
}


function getPlayer() {
    if (player) {
        return "X"
    }
    return "O"
}

function setActive(squareId) {
    let targetWon = board.squares[squareId].won;
    if(targetWon){
        for (square in board.squares) {
            board.squares[square].active = true;
            board.squares[square].el.classList.add("active")
        }
    }else{
        for (square in board.squares) {
            board.squares[square].active = false;
            board.squares[square].el.classList.remove("active")
            if (squareId == square) {
                board.squares[square].active = true;
                board.squares[square].el.classList.add("active")
            }
        }
    }
}

let board = {
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
            if(board.squares[i].values[j] === undefined && board.squares[i].active){
                board.squares[i].values[j] = getPlayer();
                if(checkWinCondition(i)){
                    board.squares[i].win();
                    checkPlayerWin();
                    console.log(`board ${i} has been won`)
                }
                updateSquares();
                setActive(j);
                player = !player;
                document.getElementById("player").innerHTML = getPlayer();
            }
        })
    }
}