const gameBoard = (function () {
    const _board = [
        ['O', '', 'O'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
    ]
    const _boardContainer = document.querySelector('.board-container')
    const marker = 'X'

    function _placeMark(e, row, column) {
        if (!e.target.innerText) {
            _board[row][column] = marker
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
        display
    }
})()
gameBoard.display()