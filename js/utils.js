


function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody class="board-table">';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell-' + i + '-' + j;

      strHTML += `<td id='${[i]}-${[j]}' onClick="cellClicked(this, ${i},${j})" class="${className}" oncontextmenu="cellMarked(this, ${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
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
      }
    }
  }
  return emptyCellsArr;
}

function isCellEmpty(idxI, idxJ, board) {
  if (board[idxI][idxJ] === ' ') return true;
  else return false;
}

