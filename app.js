const game = (function () {
    let currentPlayer

    function switchPlayer() {
        if (currentPlayer === player1) {
            currentPlayer = player2
            return
        }
        if (currentPlayer === player2 || currentPlayer == null) {
            currentPlayer = player1
            return
        }
    }

    function getCurrentPlayer() {
        return currentPlayer
    }

    return {
        getCurrentPlayer,
        switchPlayer,
    }
})()

const gameBoard = (function () {
    const _board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]
    const _boardContainer = document.querySelector('.board-container')

    function _placeMark(e, row, column) {
        if (!_board[row][column]) {
            _board[row][column] = game.getCurrentPlayer().mark
            game.switchPlayer()
            display()
        }
    }

    function _clearBoardContainer() {
        _boardContainer.innerHTML = ""
    }

    function display() {
        _clearBoardContainer()

        _board.forEach((row, rowIndex) => {
            row.forEach((element, columnIndex) => {
                const field = document.createElement("div")
                field.innerText = element
                field.addEventListener('click', e => _placeMark(e, rowIndex, columnIndex))
                _boardContainer.appendChild(field)
            })
        })
    }

    return {
        display,
    }
})()

const player = (name, mark) => {
    return {
        name,
        mark,
    }

}

const player1 = player("Joe", "X")
const player2 = player("Donald", "O")

game.switchPlayer()

gameBoard.display()