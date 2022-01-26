

//MAIN JS

var gBoard;
const MINE = '💣';
var gMines = [];
// const MINE = '<span class="mine">💣<span>';

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    inOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0 //for the timer
};

function initGame() {
    gMines = []
    gameOver();
    gGame.inOn = true;
    console.log('good luck !');
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    setMinesNegsCountTable(gBoard);
    renderValue('');
    // renderValue(gBoard);
    // console.table(gBoard);

    // console.log(setMinesNegsCountTable(gBoard));
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { minesAroundCount: 0, isMine: false, isShown: false, isMarked: false };
            // console.log(cell);
            // if ((i === 0 && j === 0) || (i === 2 && j === 2)) {
            // cell.isMine = true;
            // }
            board[i][j] = cell
        }
    }
    // board[1][0].isMine = true;
    // board[2][0].isMine = true;
    // board[2][2].isMine = true;

    for (var k = 0; k < gLevel.MINES; k++) {//to check: if not copies
        var i = getRandomInt(0, gLevel.SIZE);
        var j = getRandomInt(0, gLevel.SIZE);
        board[i][j].isMine = true;
        var mine = { i: i, j: j };
        gMines.push(mine);
        // console.log(board[i][j], i, 'i', j, 'j');
    }
    console.log(gMines);
    return board;
    // setMinesNegsCount();
}

function setMinesNegsCountTable(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(i, j)
            // console.log(board[i][j]);
        }
    }
    return;
}

function setMinesNegsCount(cellI, cellJ) {

    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        // console.log(i,'i');
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            // console.log(j,'j');
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine === true) negsCount++;
            gBoard[cellI][cellJ].minesAroundCount = negsCount;
        }
    }
    return negsCount;
}


function cellClicked(elCell, i, j) {
    if (!gGame.inOn) return;

    if (gBoard[i][j].isMarked === true) {
        console.log('you cant reveal me. im flagged!');
        return
    }
    if (gBoard[i][j].isMine === true) {
        elCell.style.backgroundColor = 'red';
        // elCell.innerHTML = '<span class="mine">💣<span>';
        console.log('GAME OVER!');
        gameOver('💣');
        return;
    }

    if (gBoard[i][j].isShown === true && gBoard[i][j].minesAroundCount !== 0) {
        console.log('Already clicked!');
        return
    }

    //Model
    gBoard[i][j].isShown = true;
    console.log(gGame.shownCount);

    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j);
        // return;
    }


    // elCell.classList.add('flipped');
    gGame.shownCount++;

    elCell.innerText = gBoard[i][j].minesAroundCount;
    console.log(elCell);

    console.log(gBoard[i][j]);
    checkGameOver();
}

function cellMarked(elCell, i, j) {
    window.event.preventDefault();

    if (gBoard[i][j].isShown === true) return;

    if (gBoard[i][j].isMarked === false) {
        elCell.innerHTML = '<span class="flag">🚩<span>';
        gBoard[i][j].isMarked = true;
        if (gBoard[i][j].isMine === true) gGame.markedCount++;
        console.log(gGame.markedCount);
    } else {
        elCell.innerHTML = '<span class="flag"><span>';
        gBoard[i][j].isMarked = false;
        if (gBoard[i][j].isMine === true) gGame.markedCount--;
    }

    console.log(gBoard[i][j], 'cell clicked');

    console.log(gGame.markedCount, 'marked count');
    checkGameOver();

}

function checkGameOver() {
    var x = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    // console.log(x);

    if ((gGame.markedCount === gLevel.MINES) || (gGame.shownCount === x)) {
        console.log('YOU WON!');
        gameOver('🚩');
        // renderValue('🚩');
        return;
    }
}

function changeDifficulty(size = 4, minesNum = 2) {
    gLevel = {
        SIZE: size,
        MINES: minesNum
    }
    initGame();
    console.log(gLevel);
    return gLevel;
}


function expandShown(board, elCell, cellI, cellJ) {
    //receive gBoard, elcell, i,j
    console.log('niceeee');

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        // console.log(i,'i');
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            // console.log(j,'j');
            if (i === cellI && j === cellJ) continue;
            //// to render value
            if(board[i][j].isShown === true) continue;
            else {
                board[i][j].isShown = true;
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                elMine.innerText = gBoard[i][j].minesAroundCount;
                gGame.shownCount++;
            }
        }
    }
    console.log(gGame.shownCount, 'count')
}

function gameOver(value) {
    console.log('GAME OVER!!!'); // todo add a modal
    renderValue(value);
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    // gGame.inOn = false;
    return;
}

function renderValue(value) {
    for (var i = 0; i < gMines.length; i++) {
        // console.log(gBoard[gMines[i].i][gMines[i].j]);
        var elMine = document.querySelector(`.cell-${gMines[i].i}-${gMines[i].j}`);
        elMine.innerText = value;
    }
}