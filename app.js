const gameBoard = (function () {
    const _board = [
        ['O', 'X', 'O'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
    ]

    function display() {
        const boardContainer = document.querySelector('.board-container')

        _board.forEach(row => {
            row.forEach((element) => {
                const field = document.createElement("div")
                field.innerText = element
                boardContainer.appendChild(field)
            })
        })
    }

    return {
        display
    }
})()

gameBoard.display()