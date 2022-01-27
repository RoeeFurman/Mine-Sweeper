

//MAIN JS
var gInterval;
var gBoard;
const MINE = '💣';
var gMines = [];
var gfirstClick = true;
var gLife = 3;
var gIsHint = false;
var gHints = 3;
// const MINE = '<span class="mine">💣<span>';

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    inOn: false,
    shownCount: 1,
    markedCount: 0,
    secsPassed: 0 //for the timer
};

function initGame() {
    changeHTML('Good Luck!', '.title');
    gGame.inOn = true;
    console.log('good luck !');
    gMines = []
    gLife = 3;
    gHints = 3
    changeHTML('⚪⚪⚪', '.hint-icon');
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    minesRenderValue('');
    gGame.secsPassed = 0;
    gfirstClick = true;
    lifeFun();
    addSmiley();
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    clearInterval(gInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '00:00';
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = { minesAroundCount: 0, isMine: false, isShown: false, isMarked: false };
            board[i][j] = cell
        }
    }
    return board;
}

function placeMines(board, clickedCellI, clickedCellJ) {
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
        // console.log(mine.i, mine.j, 'mine coord');
        // console.log(clickedCellI, clickedCellJ, 'cell coord');
        gMines.push(mine);
        // console.log(gMines.length);
        // console.log(gLevel.MINES);
        if (gMines.length === gLevel.MINES) break;
        // console.log(board[i][j], i, 'i', j, 'j');
        console.log(gMines);
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
        // console.log(i,'i');
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            // console.log(j,'j');
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine === true) negsCount++;
            // gBoard[cellI][cellJ].minesAroundCount = negsCount;
        }
    }
    return negsCount;
}

function cellClicked(elCell, i, j) {
    // function cellClicked(elCell, i, j) {
    if (!gGame.inOn) return;

    if (gfirstClick) {
        placeMines(gBoard, i, j);
        setMinesNegsCountTable(gBoard);
        runTimer()
        gfirstClick = false;
    }

    if (gBoard[i][j].isMarked) {
        console.log('you cant reveal me. im flagged!');
        return;
    } else if (gBoard[i][j].isShown) {
        if (gBoard[i][j].minesAroundCount !== 0) {
            console.log('Already clicked!');
            return;
        } else if (gBoard[i][j].minesAroundCount === 0) {
            if (gIsHint === true) {
                console.log('walla');
                hintMe(elCell, i, j);
                return;
            }
            console.log('0');
            expandShown(gBoard, elCell, i, j);
        }
    } else if (gBoard[i][j].isMine === true) {
        if (gIsHint === true) {
            console.log('walla');
            hintMe(elCell, i, j);
            return;
        } else {
            // console.log('mine');
            gLife--;
            // console.log('glife', gLife);
            elCell.innerHTML = '💣';
            gBoard[i][j].isShown = true;
            gBoard[i][j].minesAroundCount = 'mine';
            lifeFun();
            checkGameOver(elCell);
        }
    } else {
        if (gIsHint === true) {
            console.log('walla');
            hintMe(elCell, i, j);
            return;
        }
        if (gBoard[i][j].minesAroundCount === 0) expandShown(gBoard, elCell, i, j);
        elCell.innerText = gBoard[i][j].minesAroundCount;
        gGame.shownCount++;
        gBoard[i][j].isShown = true;
        elCell.style.backgroundColor = 'rgb(184, 162, 184)';
        // console.log(elCell);

        console.log(gBoard[i][j]);
        console.log(gGame.shownCount);
    }
    checkGameOver(elCell);
}

// function cellClicked1(elCell, i, j) {
//     if (!gGame.inOn) return;

//     if (gfirstClick) {
//         placeMines(gBoard, i, j);
//         setMinesNegsCountTable(gBoard);
//         runTimer()
//         gfirstClick = false;
//     }

//     if (gBoard[i][j].isShown) return;

//     if (gBoard[i][j].isMarked === true) {
//         console.log('you cant reveal me. im flagged!');
//         return
//     }

//     if (gBoard[i][j].isMine === true) {
//         // elCell.innerHTML = '<span class="mine">💣<span>';
//         gLife--;
//         elCell.innerHTML = '💣';
//         gBoard[i][j].isShown = true;
//         lifeFun();
//         checkGameOver();
//         if (gLife === 0) {
//             elCell.style.backgroundColor = 'red';
//             console.log('GAME OVER!');
//             gameOver('💣');
//             return;
//         }
//     }
//     if (gBoard[i][j].isShown === true && gBoard[i][j].minesAroundCount !== 0) {
//         console.log('Already clicked!');
//         return
//     }

//     //Model
//     if (gBoard[i][j].isShown !== true) gGame.shownCount++;
//     gBoard[i][j].isShown = true;

//     if (gBoard[i][j].isMine !== true && gBoard[i][j].minesAroundCount === 0) {
//         expandShown(gBoard, elCell, i, j);
//         // return;
//     }

//     if (gBoard[i][j].isMine !== true) {
//         elCell.innerText = gBoard[i][j].minesAroundCount;
//         elCell.style.backgroundColor = 'rgb(184, 162, 184)';
//         console.log(elCell);

//         console.log(gBoard[i][j]);
//         console.log(gGame.shownCount);
//     }

//     checkGameOver();
// }

function hintMe(elCell, cellI, cellJ) {

    if (!gHints) return;

    gHints--;
    console.log(gHints, 'num of hints');
    console.log('now reveal')

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            // if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isShown === true) continue;
            else {
                // gBoard[i][j].isShown = true;
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                elMine.innerText = gBoard[i][j].minesAroundCount;
                elMine.style.color = 'white';
                elMine.style.backgroundColor = 'black';
                // gGame.shownCount++;
            }
        }
    }

    setTimeout(() => {

        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gLevel.SIZE) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gLevel.SIZE) continue;
                // if (i === cellI && j === cellJ) continue;
                if (gBoard[i][j].isShown === true) continue;
                else {
                    // gBoard[i][j].isShown = true;
                    var elMine = document.querySelector(`.cell-${i}-${j}`);
                    elMine.innerText = '';
                    elMine.style.backgroundColor = 'rgb(148, 108, 148)';
                    elMine.style.color = 'black';
                    if (gHints === 2) changeHTML('⚪⚪⚫', '.hint-icon');
                    if (gHints === 1) changeHTML('⚪⚫⚫', '.hint-icon');
                    if (gHints === 0) changeHTML('⚫⚫⚫', '.hint-icon');
                    // gGame.shownCount++;
                }
            }
        }

        console.log('now stop reveal')
    }, 700);


    gIsHint = false;
    console.log(gIsHint, 'gishint');
}

function hintOn() {
    gIsHint = true;
    console.log(gIsHint, 'gishint');
    console.log('yalla');
}

function runTimer() {
    var clock;
    var min = 0;

    gInterval = setInterval(() => {
        gGame.secsPassed += 1;
        if (gGame.secsPassed < 10) {
            clock = '0' + min + ':0' + gGame.secsPassed;
        } else if (gGame.secsPassed < 60) {
            clock = '0' + min + ':' + gGame.secsPassed;
        } else {
            min += 1;
            gGame.secsPassed = 0;
            clock = '0' + min + ':0' + gGame.secsPassed;
        }

        var elTimer = document.querySelector('.timer');
        elTimer.innerText = clock;
    }, 1000)
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

function checkGameOver(elCell) {
    var x = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    // console.log(x);

    if ((gLife === 0) || (gLevel.MINES === 2 && gLife === 1)) {
        elCell.style.backgroundColor = 'red';
        console.log('GAME OVER!');
        changeHTML('GAME OVER!', '.title');
        changeHTML('😖', '.smiley');
        gameOver('💣');
        return;
    }

    if ((gGame.markedCount === gLevel.MINES) && (gGame.shownCount === x) || ((gGame.shownCount === x))) {
        elCell.style.backgroundColor = 'rgb(179, 170, 179)';
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
    initGame();
    return gLevel;
}

function addSmiley() { /// check maybe can be deleted
    changeHTML('😏', '.smiley');
    // var smiley = document.querySelector('.smiley');
    // smiley.innerHTML = '🙂';
}

function lifeFun() {
    if (gLife === 3) changeHTML('♥ ♥ ♥', '.life');
    else if (gLife === 2) changeHTML('♥ ♥', '.life');
    else if (gLife === 1) changeHTML('♥', '.life');
    else changeHTML('', '.life');
    // var life = document.querySelector('.life');
    // life.innerHTML = '♥ ♥ ♥';
}

function expandShown(board, elCell, cellI, cellJ) {
    console.log('niceeee');

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isShown === true) continue;
            else {
                board[i][j].isShown = true;
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                elMine.innerText = gBoard[i][j].minesAroundCount;
                elMine.style.backgroundColor = 'rgb(184, 162, 184)';
                gGame.shownCount++;
            }
        }
    }
    console.log(gGame.shownCount, 'count')
}

function gameOver(value) {
    console.log('PLAY AGAIN?!?!');
    minesRenderValue(value);
    gGame.inOn = false;
    clearInterval(gInterval);
    return;
}

function minesRenderValue(value) {
    for (var i = 0; i < gMines.length; i++) {
        // console.log(gBoard[gMines[i].i][gMines[i].j]);
        var elMine = document.querySelector(`.cell-${gMines[i].i}-${gMines[i].j}`);
        // elMine.innerHTML = value;
        elMine.innerHTML = `<span class="emoji">${value}<span>`;
    }
}

function changeHTML(value, classname) {
    var smiley = document.querySelector(classname);
    // console.log(smiley);
    return smiley.innerHTML = value;
}