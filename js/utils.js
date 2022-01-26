



// function getCurrMines(board){
//   for (var k = 0; k < gLevel.SIZE; k++) {
//     var randCell = getRandomCell(board);
//     console.log(randCell);
// }
// }

// function getRandomCell(board) {
//   var i = getRandomInt(0, gLevel.SIZE);
//   var j = getRandomInt(0, gLevel.SIZE);
//   console.log('i', i, 'j', j);
//   var currCell = { i: i, j: j };
//   return currCell
// }

function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody class="board-table">';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      // var display = '';
      var className = 'cell-' + i + '-' + j;

      strHTML += `<td id='${[i]}-${[j]}' onClick="cellClicked(this, ${i},${j})" class="${className}" oncontextmenu="cellMarked(this, ${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  // console.log(strHTML);
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function renderMonsterColor(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.span.style.color = value;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function shuffle(items) {
  var randIdx, keep
  for (var i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);

    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

function makeEmptyCellsArr(board) {
  var emptyCellsArr = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (isCellEmpty(i, j, board)) {
        emptyCellsArr.push({ i: i, j: j });
        // console.log(emptyCellsArr);
      }
    }
  }
  return emptyCellsArr;
}

function isCellEmpty(idxI, idxJ, board) {
  // console.log(board[idxI][idxJ].gameElement)
  if (board[idxI][idxJ] === ' ') return true;
  else return false;
}


// function countNegs(cellI, cellJ, mat) {
//   var negsCount = 0;
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= mat.length) continue;
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (j < 0 || j >= mat[i].length) continue;
//       if (i === cellI && j === cellJ) continue;
//       // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
//       if (mat[i][j]) negsCount++;
//     }
//   }
//   return negsCount;
// }


// function cellClicked(elCell, cellI, cellJ) {
//   // console.log('elCell', elCell)
//   if (gBoard[cellI][cellJ] === LIFE) {
//       // Update the Model:
//       gBoard[cellI][cellJ] = SUPER_LIFE
//       // Update the Dom:
//       elCell.innerText = SUPER_LIFE
//       blowUpNegs(cellI, cellJ, gBoard)
//   }
//   // console.table(gBoard)
// }

// function blowUpNegs(cellI, cellJ, mat) {
//   // console.log('cellI', cellI)
//   // console.log('cellJ', cellJ)
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//       if (i < 0 || i >= mat.length) continue;
//       for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//           if (j < 0 || j >= mat[i].length) continue;
//           if (i === cellI && j === cellJ) continue;
//           var cell = mat[i][j];
//           // console.log('cell', cell);
//           if (cell === LIFE) {
//               // Update the Model:
//               mat[i][j] = ''
//               // Update the Dom:
//               var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
//               elCell.innerText = ''
//               elCell.classList.remove('occupied')
//           }
//       }
//   }
// }
