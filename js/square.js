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
    ],
    players: [],
    turn: "X"
}