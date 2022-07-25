const game = (function () {
    let _currentPlayer
    let _isGameOn

    function switchPlayer() {
        if (_currentPlayer === player1) {
            _currentPlayer = player2
            formController.highlightPlayer("player2")
            return
        }
        if (_currentPlayer === player2 || _currentPlayer == null) {
            _currentPlayer = player1
            formController.highlightPlayer("player1")
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
        formController.highlightPlayer()
    }

    function start(type) {
        _isGameOn = true
        gameBoard.clearMemory()
        displayController.hideResult()
        displayController.displayBoard()
        formController.hideEditButtons()

        if (type === 'restart') {
            score.reset()
            displayController.showStartScreen()
            formController.showEditButtons()
        } else {
            game.switchPlayer()
        }
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
        game.switchPlayer()
        _checkGameEnd()
        displayController.displayBoard()
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
    const _newGameControls = document.querySelector('.new-game-controlls')
    const _gameOverControls = document.querySelector('.game-over-controlls')

    function setEventListeners() {
        const restartButton = document.querySelector('.restart')
        restartButton.addEventListener('click', () => game.start('restart'))

        const nextRoundButton = document.querySelector('.next')
        nextRoundButton.addEventListener('click', () => game.start())

        const newGameButton = document.querySelector('.new-game')
        newGameButton.addEventListener('click', () => game.start(''))
    }

    function showStartScreen() {
        _gameOverControls.classList.add('hidden')
        _newGameControls.classList.remove('hidden')

        _messageContainer.innerText = 'New game'
        _messageContainer.classList.remove('draw-message')
        _messageContainer.classList.add('win-message')

        _messageWindow.classList.add('window-shown')
    }

    function showResult(result) {
        _gameOverControls.classList.remove('hidden')
        _newGameControls.classList.add('hidden')

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

    function _clearBoardContainer() {
        _boardContainer.innerHTML = ''
    }

    function _addToBoardContainer(node) {
        _boardContainer.appendChild(node)
    }

    return {
        showResult,
        hideResult,
        displayBoard,
        setEventListeners,
        showStartScreen,
    }
})()

const formController = (function () {
    const _playerCard = document.querySelectorAll('.player-card')
    const _playerForm = document.querySelectorAll('.player-form')
    const editPlayer1Button = document.querySelector('.edit-player1')
    const editPlayer2Button = document.querySelector('.edit-player2')

    function setEventListeners() {
        editPlayer1Button.addEventListener('click', e => _handleForm(e, '1', 'open'))
        editPlayer2Button.addEventListener('click', e => _handleForm(e, '2', 'open'))

        const closePlayer1Button = document.querySelector('.close-player1')
        closePlayer1Button.addEventListener('click', e => _handleForm(e, '1', 'close'))

        const closePlayer2Button = document.querySelector('.close-player2')
        closePlayer2Button.addEventListener('click', e => _handleForm(e, '2', 'close'))
    }

    function showEditButtons() {
        editPlayer1Button.classList.remove('hidden')
        editPlayer2Button.classList.remove('hidden')
    }

    function hideEditButtons() {
        _handleForm('', '1', 'close')
        _handleForm('', '2', 'close')
        editPlayer1Button.classList.add('hidden')
        editPlayer2Button.classList.add('hidden')
    }

    function highlightPlayer(player) {
        const player1Wrapper = document.querySelector('.player1-wrapper')
        const player2Wrapper = document.querySelector('.player2-wrapper')
        switch (player) {
            case "player1":
                player1Wrapper.classList.add('highlight')
                player2Wrapper.classList.remove('highlight')
                break
            case "player2":
                player1Wrapper.classList.remove('highlight')
                player2Wrapper.classList.add('highlight')
                break
            default:
                player1Wrapper.classList.remove('highlight')
                player2Wrapper.classList.remove('highlight')
                break
        }
    }

    function _handleForm(event, playerNumber, eventType) {
        event && event.preventDefault()

        const playerInput = document.querySelector(`#player${playerNumber}`)
        const player = playerNumber === '1' ? player1 : player2

        if (playerInput.value.trim().length < 1) {
            playerInput.value = `Player ${playerNumber}`
        }

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
        showEditButtons,
        hideEditButtons,
        highlightPlayer,
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
        const player1Score = document.querySelector('.player1-score')
        player1Score.innerText = player1.score
        const player2Score = document.querySelector('.player2-score')
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

game.start('restart')
displayController.setEventListeners()
formController.setEventListeners()