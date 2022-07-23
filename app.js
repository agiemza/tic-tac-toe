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
            _checkGameEnd()
        }
    }

    function _winDetector(field1, field2, field3) {
        if (!!_board[field1[0]][field1[1]]
            && _board[field1[0]][field1[1]] === _board[field2[0]][field2[1]]
            && _board[field1[0]][field1[1]] === _board[field3[0]][field3[1]]) {
            console.log("win")
        }
    }

    function _drawDetector() {
        let filledFields = 0

        _board.forEach(row => {
            row.forEach(cell => {
                if (cell.length > 0) {
                    filledFields++
                }
            })
        })

        while (filledFields === _board.length ** 2) {
            console.log("draw")
            break
        }
    }

    function _checkGameEnd() {

        // check rows
        _winDetector([0, 0], [0, 1], [0, 2])
        _winDetector([1, 0], [1, 1], [1, 2])
        _winDetector([2, 0], [2, 1], [2, 2])

        // check columns
        _winDetector([0, 0], [1, 0], [2, 0])
        _winDetector([0, 1], [1, 1], [2, 1])
        _winDetector([0, 2], [1, 2], [2, 2])

        //check diagonal
        _winDetector([0, 0], [1, 1], [2, 2])
        _winDetector([0, 2], [1, 1], [2, 0])

        _drawDetector()
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