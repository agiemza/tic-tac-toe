const game = (function () {
    let _currentPlayer
    let _isGameOn

    function switchPlayer() {
        if (_currentPlayer === player1) {
            _currentPlayer = player2
            return
        }
        if (_currentPlayer === player2 || _currentPlayer == null) {
            _currentPlayer = player1
            return
        }
    }

    function getCurrentPlayer() {
        return _currentPlayer
    }

    function isOn() {
        return _isGameOn
    }

    function finish() {
        _isGameOn = false
    }

    function start() {
        _isGameOn = true
    }

    return {
        getCurrentPlayer,
        switchPlayer,
        isOn,
        start,
        finish,
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
            _endTurn()
        }
    }

    function _endTurn() {
        game.switchPlayer()
        display()
        _checkGameEnd()
    }

    function _winDetector(field1, field2, field3) {
        if (!!_board[field1[0]][field1[1]]
            && _board[field1[0]][field1[1]] === _board[field2[0]][field2[1]]
            && _board[field1[0]][field1[1]] === _board[field3[0]][field3[1]]) {
            _finishGame('win')
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
            _finishGame('draw')
            break
        }
    }

    function _finishGame(result) {
        console.log(result)
        game.finish()
        _boardContainer.classList.add('disabled')
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
        
        game.isOn() && _drawDetector()
    }

    function _clearBoardContainer() {
        _boardContainer.innerHTML = ''
    }

    function display() {
        _clearBoardContainer()

        _board.forEach((row, rowIndex) => {
            row.forEach((element, columnIndex) => {
                const field = document.createElement('div')
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

const player1 = player('Joe', 'X')
const player2 = player('Donald', 'O')

game.start()
game.switchPlayer()
gameBoard.display()