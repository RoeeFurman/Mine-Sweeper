
//MAIN JS
// Mine Sweeper - Roee Furman

const MINE = '💣';
var gInterval;
var gBoard;
var gMines = [];
var gfirstClick = true;
var gLife = 3;
var gIsHint = false;
var gHints = 3;
var setMinesManual = false;
var minesCountManually = 2;
var gSevenBoom = false;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    inOn: false,
    shownCount: 1,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    // console.log('good luck !');
    changeHTML('Good Luck!', '.title');
    gGame.inOn = true;
    gMines = []
    gLife = 3;
    gHints = 3;
    gSafe = 3;
    minesCountManually = gLevel.MINES;
    changeHTML('😏', '.smiley');
    changeHTML('⚪⚪⚪', '.hint-icon');
    changeHTML('🎯🎯🎯', '.safe-icon');
    changeHTML('', '.status-manual-mines');
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    minesRenderValue('');
    gGame.secsPassed = 0;
    gfirstClick = true;
    setMinesManual = false;
    lifeFun();
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    clearInterval(gInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '00:00';
    if (gLevel.MINES === 9) gLevel.MINES = 12; //for 7boom-mode at medium level
}

function buildBoard() {
    var idx = 0;
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { minesAroundCount: 0, isMine: false, isShown: false, isMarked: false, id: idx++ };
            board[i][j] = cell
        }
    }
    return board;
}

function placeMines(board, clickedCellI, clickedCellJ) {

    if (!gSevenBoom) {
        for (var k = 0; k < 1000; k++) {
            var i = getRandomInt(0, gLevel.SIZE);
            var j = getRandomInt(0, gLevel.SIZE);

            if (i === clickedCellI && j === clickedCellJ) continue;

            if (board[i][j].isMine === true) { // check if not doubles
                continue
            } else {
                board[i][j].isMine = true;
            }

            var mine = { i: i, j: j };
            gMines.push(mine);
            if (gMines.length === gLevel.MINES) break;
            // console.log(gMines);
            // }
        }
    } else {
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var currCell = gBoard[i][j];
                // console.log(currCell);
                if ((currCell.id % 7 === 0 && currCell.id) || (currCell.id >= 70 && currCell.id < 80)) {
                    currCell.isMine = true;
                    mine = { i: i, j: j };
                    gMines.push(mine);
                    // console.log(currCell.id);
                }
            }
        }
        console.log(gSevenBoom);
    }
    return gMines;
}

function setMinesNegsCountTable(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(i, j);
            if (board[i][j].isMine) {
                board[i][j].minesAroundCount = MINE;
            }
        }
    }
    return;
}

function setMinesNegsCount(cellI, cellJ) {

    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) negsCount++;
        }
    }
    return negsCount;
}

function cellClicked(elCell, i, j) {
    // console.log(gBoard[i][j]);
    if (!gGame.inOn) return;

    if (setMinesManual && gfirstClick) {
        // console.log('set manually, pick a cell, nothing will be clicked, try it');
        // console.log(minesCountManually, 'here is mine');
        if (gBoard[i][j].isMine) return;
        else (gBoard[i][j].isMine = true);

        var mine = { i: i, j: j };
        gMines.push(mine);

        // console.log(gBoard[i][j].isMine, 'worked?');
        minesCountManually--;
        changeHTML(`${minesCountManually} 💣 to go`, '.status-manual-mines');

        // console.log(minesCountManually, 'new mines num');
        if (minesCountManually) return;
        else {
            changeHTML('PLAY!', '.status-manual-mines');
            setMinesNegsCountTable(gBoard);
            runTimer()
            gfirstClick = false;
            setMinesManual = false;
            return;
        }
    }

    if (gfirstClick) {
        placeMines(gBoard, i, j);
        setMinesNegsCountTable(gBoard);
        runTimer()
        gfirstClick = false;
    }

    if (gBoard[i][j].isMarked) {
        // console.log('you cant reveal me. im flagged!');
        return;
    } else if (gBoard[i][j].isShown) {
        if (!gBoard[i][j].minesAroundCount) {
            // console.log('Already clicked!');
            return;
        } else if (!gBoard[i][j].minesAroundCount) {
            if (gIsHint) {
                hintMe(elCell, i, j);
                return;
            }
            // console.log('0');
            expandShown(gBoard, elCell, i, j);
        }
    } else if (gBoard[i][j].isMine) {
        if (gIsHint) {
            hintMe(elCell, i, j);
            return;
        } else {
            gLife--;
            elCell.innerHTML = '💣';
            gBoard[i][j].isShown = true;
            gBoard[i][j].minesAroundCount = 'mine';
            lifeFun();
            checkGameOver(elCell);
        }
    } else {
        if (gIsHint) {

            hintMe(elCell, i, j);
            return;
        }
        if (!gBoard[i][j].minesAroundCount) {
            expandShown(gBoard, elCell, i, j);
        }
        if (!gBoard[i][j].minesAroundCount) {
            elCell.innerText = '';
        }
        else elCell.innerText = gBoard[i][j].minesAroundCount;
        gBoard[i][j].isShown = true;
        elCell.style.backgroundColor = 'rgb(184, 162, 184)';
    }
    checkGameOver(elCell);
}

function setMinesManually() {
    if (setMinesManual) return;
    setMinesManual = true;
    if (gfirstClick) {
        changeHTML('ON - click board', '.status-manual-mines');
        changeHTML('Mines Manually Mode', '.title');
    }
    else changeHTML('❌', '.status-manual-mines')
    console.log('set mines manually is on!!! and its awsome!')
}

function sevenBoom() {
    initGame();
    if (gLevel.MINES === 12) gLevel.MINES = 9;
    changeHTML('7-Boom mode', '.title');
    gSevenBoom = true;
    console.log('7boom - go!');
}

function hintMe(elCell, cellI, cellJ) {

    if (!gHints) return;

    gHints--;
    // console.log(gHints, 'num of hints');
    // console.log('now reveal')

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (gBoard[i][j].isShown) continue;
            else {
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                if (!gBoard[i][j].minesAroundCount) {
                    elMine.innerText = '';
                }
                else elMine.innerText = gBoard[i][j].minesAroundCount;
                elMine.style.color = 'white';
                elMine.style.backgroundColor = 'black';
            }
        }
    }

    setTimeout(() => {

        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gLevel.SIZE) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gLevel.SIZE) continue;
                if (gBoard[i][j].isShown) continue;
                else {
                    var elMine = document.querySelector(`.cell-${i}-${j}`);
                    elMine.innerText = '';
                    elMine.style.backgroundColor = 'rgb(148, 108, 148)';
                    elMine.style.color = 'black';
                    if (gHints === 2) changeHTML('⚪⚪⚫', '.hint-icon');
                    if (gHints === 1) changeHTML('⚪⚫⚫', '.hint-icon');
                    if (gHints === 0) changeHTML('⚫⚫⚫', '.hint-icon');
                }
            }
        }

        // console.log('now stop reveal')
    }, 500);


    gIsHint = false;
    // console.log(gIsHint, 'gishint');
}

function safeMode() {
    if (!gSafe) return;
    if (gIsHint) return;
    if (!gGame.inOn) return;
    gSafe--;
    var safecells = [];
    // console.log('safeClick is ON');
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown) continue;
            else if (gBoard[i][j].isMarked) continue;
            else if (gBoard[i][j].isMine) continue;
            else safecells.push({ i: i, j: j });
        }
    }
    if (!safecells.length) return;
    var safeCell = safecells[getRandomInt(0, safecells.length)];
    // console.log(safeCell);
    changeHTML('🎯', `.cell-${safeCell.i}-${safeCell.j}`);

    setTimeout(() => {
        // 'cell-' + i + '-' + j
        changeHTML(``, `.cell-${safeCell.i}-${safeCell.j}`);
        if (gSafe === 2) changeHTML('🎯🎯⚫', '.safe-icon');
        if (gSafe === 1) changeHTML('🎯⚫⚫', '.safe-icon');
        if (gSafe === 0) changeHTML('⚫⚫⚫', '.safe-icon');
    }, 300);

}

function hintOn() {
    gIsHint = true;
    // console.log(gIsHint, 'gishint');
    // console.log('yalla');
}

function cellMarked(elCell, i, j) {
    window.event.preventDefault();

    if (setMinesManual) {
        console.log('pick a cell, nothing will be marked, try it');
        setMinesManual = false;
        return;
    }

    if (gBoard[i][j].isShown) return;

    if (!gBoard[i][j].isMarked) {
        elCell.innerHTML = '<span class="flag">🚩<span>';
        gBoard[i][j].isMarked = true;
        if (gBoard[i][j].isMine) gGame.markedCount++;
        // console.log(gGame.markedCount);
    } else {
        elCell.innerHTML = '<span class="flag"><span>';
        gBoard[i][j].isMarked = false;
        if (gBoard[i][j].isMine) gGame.markedCount--;
    }

    // console.log(gBoard[i][j], 'cell clicked');

    // console.log(gGame.markedCount, 'marked count');
    checkGameOver();

}

function checkGameOver(elCell) {
    var counter = 0;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isShown && !currCell.isMine) counter++;
        }
    }
    gGame.shownCount = counter;

    var x = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;

    if ((gLife === 0) || (gLevel.MINES === 2 && gLife === 1)) {
        elCell.style.backgroundColor = 'red';
        console.log('GAME OVER!');
        changeHTML('GAME OVER!', '.title');
        changeHTML('😖', '.smiley');
        gameOver('💣');
        return;
    }

    if ((gGame.markedCount === gLevel.MINES) && (gGame.shownCount === x) || ((gGame.shownCount === x))) {
        // finishTime = Date.now();
        // console.log(finishTime);
        // checkBestTime();
        elCell.style.backgroundColor = 'rgb(255, 247, 177)';
        console.log('You WIN!');
        changeHTML('You WIN!', '.title');
        changeHTML('🤗', '.smiley');
        gameOver('🚩');
        return;
    }
}

function changeDifficulty(size = 4, minesNum = 2) {
    gLevel = {
        SIZE: size,
        MINES: minesNum
    }
    minesCountManually = minesNum;
    initGame();
    // return gLevel;
}

function lifeFun() {
    if (gLife === 3) changeHTML('♥ ♥ ♥', '.life');
    else if (gLife === 2) changeHTML('♥ ♥', '.life');
    else if (gLife === 1) changeHTML('♥', '.life');
    else changeHTML('', '.life');
}

function expandShown(board, elCell, cellI, cellJ) {
    // console.log('niceeee');

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isShown) continue;
            if (board[i][j].isMarked) continue;
            else {
                board[i][j].isShown = true;
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                // console.log(board[i][j].minesAroundCount);
                // if (board[i][j].minesAroundCount === 0) {
                // elMine.innerText = '';
                // }
                if (!gBoard[i][j].minesAroundCount) {
                    elMine.innerText = '';
                }
                else elMine.innerText = gBoard[i][j].minesAroundCount;
                // elMine.innerText = gBoard[i][j].minesAroundCount;
                if (!gBoard[i][j].minesAroundCount) {
                    expandShown(gBoard, elCell, i, j);
                }
                elMine.style.backgroundColor = 'rgb(184, 162, 184)';
            }
        }
    }
    // console.log(gGame.shownCount, 'count')
}

function gameOver(value) {
    console.log('PLAY AGAIN?!?!');
    minesRenderValue(value);
    gGame.inOn = false;
    gSevenBoom = false;
    clearInterval(gInterval);
    return;
}

function minesRenderValue(value) {
    for (var i = 0; i < gMines.length; i++) {
        var elMine = document.querySelector(`.cell-${gMines[i].i}-${gMines[i].j}`);
        elMine.innerHTML = `<span class="emoji">${value}<span>`;
    }
}
