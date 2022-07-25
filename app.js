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

    function finish(result) {
        _isGameOn = false
        displayController.showResult(result)
    }

    function start(isNew) {
        if (isNew === 'new') {
            score.reset()
            game.switchPlayer()
        }
        _isGameOn = true
        displayController.hideResult()
        gameBoard.clearMemory()
        displayController.displayBoard()
    }

    function addPoint(player) {
        player.score++
    }

    function addPoint(player) {
        player.score++
    }

    return {
        getCurrentPlayer,
        switchPlayer,
        isOn,
        start,
        finish,
        addPoint,
    }
})()

const gameBoard = (function () {
    let _board

    function clearMemory() {
        _board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]
    }

    function getMemory() {
        return _board
    }

    function placeMark(e, row, column) {
        if (!_board[row][column]) {
            _board[row][column] = game.getCurrentPlayer().mark
            _endTurn()
        }
    }

    function _endTurn() {
        _checkGameEnd()
        displayController.displayBoard()
        game.switchPlayer()
    }

    function _winDetector(field1, field2, field3) {
        const value1 = _board[field1[0]][field1[1]]
        const value2 = _board[field2[0]][field2[1]]
        const value3 = _board[field3[0]][field3[1]]

        if (!!value1 && value1 === value2 && value1 === value3) {
            game.finish('win')
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
            game.finish('draw')
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

        game.isOn() && _drawDetector()
    }

    return {
        clearMemory,
        getMemory,
        placeMark,
    }
})()

const displayController = (function () {
    const _boardContainer = document.querySelector('.board-container')
    const _messageWindow = document.querySelector('.message-window')
    const _messageContainer = document.querySelector('.message-container')

    function _clearBoardContainer() {
        _boardContainer.innerHTML = ''
    }

    function _addToBoardContainer(node) {
        _boardContainer.appendChild(node)
    }

    function showResult(result) {
        if (result === 'win') {
            score.addPoint()
            _messageContainer.innerText = `${game.getCurrentPlayer().name} wins!`
            _messageContainer.classList.remove('draw-message')
            _messageContainer.classList.add('win-message')
        }

        if (result === 'draw') {
            _messageContainer.innerText = 'DRAW!'
            _messageContainer.classList.remove('win-message')
            _messageContainer.classList.add('draw-message')
        }
        _messageWindow.classList.add('window-shown')
    }

    function hideResult() {
        _messageWindow.classList.remove('window-shown')
    }

    function setEventListeners() {
        const restartButton = document.querySelector('.restart')
        restartButton.addEventListener('click', () => game.start('new'))

        const nextRoundButton = document.querySelector('.next')
        nextRoundButton.addEventListener('click', () => game.start())
    }


    function displayBoard() {
        _clearBoardContainer()

        const _board = gameBoard.getMemory()

        _board.forEach((row, rowIndex) => {
            row.forEach((element, columnIndex) => {
                const field = document.createElement('div')
                field.innerText = element
                field.addEventListener('click', e => gameBoard.placeMark(e, rowIndex, columnIndex))
                _addToBoardContainer(field)
            })
        })
    }

    return {
        showResult,
        hideResult,
        displayBoard,
        setEventListeners,
    }
})()

const formController = (function () {
    const _playerCard = document.querySelectorAll('.player-card')
    const _playerForm = document.querySelectorAll('.player-form')

    function setEventListeners() {
        const editPlayer1Button = document.querySelector('.edit-player1')
        editPlayer1Button.addEventListener('click', e => _handleForm(e, '1', "open"))

        const closePlayer1Button = document.querySelector('.close-player1')
        closePlayer1Button.addEventListener('click', e => _handleForm(e, '1', "close"))

        const editPlayer2Button = document.querySelector('.edit-player2')
        editPlayer2Button.addEventListener('click', e => _handleForm(e, '2', "open"))

        const closePlayer2Button = document.querySelector('.close-player2')
        closePlayer2Button.addEventListener('click', e => _handleForm(e, '2', "close"))
    }

    function _handleForm(event, playerNumber, eventType) {
        event.preventDefault()

        const playerInput = document.querySelector(`#player${playerNumber}`)
        const player = playerNumber === '1' ? player1 : player2

        if (eventType === 'close') {
            _changeName(player, playerInput.value, playerNumber)
            _playerCard[playerNumber - 1].classList.remove('hidden')
            _playerForm[playerNumber - 1].classList.add('hidden')
        }

        if (eventType === 'open') {
            playerInput.value = player.name
            _playerCard[playerNumber - 1].classList.add('hidden')
            _playerForm[playerNumber - 1].classList.remove('hidden')
            playerInput.focus()
        }
    }

    function _changeName(player, name, playerNumber) {
        const playerNameContainer = document.querySelectorAll('.player-name')[playerNumber - 1]
        player.name = name
        playerNameContainer.innerText = name
    }

    return {
        setEventListeners,
    }
})()

const score = (function () {

    function reset() {
        player1.score = 0
        player2.score = 0
        _update()
    }
    function addPoint() {
        game.getCurrentPlayer().score++
        _update()
    }

    function _update() {
        const player1Score = document.querySelector(".player1-score")
        player1Score.innerText = player1.score
        const player2Score = document.querySelector(".player2-score")
        player2Score.innerText = player2.score
    }

    return {
        reset,
        addPoint,
    }
})()

const player = (name, mark) => {
    return {
        name,
        mark,
        score: 0,
    }
}
const player1 = player('Player 1', 'X')
const player2 = player('Player 2', 'O')

game.start('new')
displayController.setEventListeners()
formController.setEventListeners()