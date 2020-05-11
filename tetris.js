const cvs = document.getElementById('tetris')
const ctx = cvs.getContext('2d')
const scoreEl = document.getElementById('score')

const ROW = 20
const COL = COLUMN = 10
const SQ = squareSize = 20
const VACANT = 'WHITE'

// draw a square

function drawSquare(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ)

  ctx.strokeStyle = 'BLACK'
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ)

}

// create the board

let board = []
for(let r = 0; r < ROW; r++){
  board[r] = []
  for(let c = 0; c < COL; c++){
    board[r][c] = VACANT
  }
}

// draw the board

function drawBoard() {
  for(let r = 0; r < ROW; r++){
    for(let c = 0; c < COL; c++){
      drawSquare(c,r,board[r][c])
    }
  }
}

drawBoard()

// the pieces and colors

const PIECES = [
  [Z, 'red'],
  [S, 'green'],
  [T, 'yellow'],
  [O, 'blue'],
  [L, 'purple'],
  [I, 'cyan'],
  [J,'orange']
]

// initiate a pieces

function randomPiece() {
  let r = randomN = Math.floor(Math.random() * PIECES.length)
  return new Piece(PIECES[r][0],PIECES[r][1])
}


let p = randomPiece()

// The object piece

function Piece(tetromino, color) {
  this.tetromino = tetromino
  this.color = color

  this.tetrominoN = 0
  this.activeTetromino = this.tetromino[this.tetrominoN]

  this.x = 4
  this.y = -2
}

// draw a piece to the board

Piece.prototype.fill = function(color) {
  for(let r = 0; r < this.activeTetromino.length; r++) {
    for(let c = 0; c < this.activeTetromino.length; c++){
      if(this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color)
      }
    }
  }
}

Piece.prototype.draw = function() {
  this.fill(this.color)
}

// undraw the piece

Piece.prototype.unDraw = function() {
  this.fill(VACANT)
}

// move the piece

Piece.prototype.moveDown = function() {
  if(!this.collision(0,1,this.activeTetromino)) {
    this.unDraw()
    this.y++
    this.draw()
  } else {
    // lock and gen nw piece
    this.lock()
    p = randomPiece()
  }
}

// move right

Piece.prototype.moveRight = function() {
  if(!this.collision(1,0,this.activeTetromino)) {
    this.unDraw()
    this.x++
    this.draw()

  }
}

// move left

Piece.prototype.moveLeft = function() {
  if(!this.collision(-1,0,this.activeTetromino)) {
    this.unDraw()
    this.x--
    this.draw()
  }
}

// rotate

Piece.prototype.rotate = function() {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]

  let kick = 0
  if(this.collision(0,0,nextPattern)) {
    if(this.x > COL/2) {
      // its the right wall
      kick = -1 // we need to move the piece to the left
    } else {
      // its the left wall
      kick = 1 // we need to move the piece to the right
    }
  }
  if(!this.collision(kick,0,nextPattern)) {
    this.unDraw()
    this.x += kick
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length
    this.activeTetromino = this.tetromino[this.tetrominoN]
    this.draw()
  }
}

let score = 0

Piece.prototype.lock = function() {
  for(let r = 0; r < this.activeTetromino.length; r++) {
    for(let c = 0; c < this.activeTetromino.length; c++){
      // we skip vacant squares
      if(!this.activeTetromino[r][c]) {
        continue
      }
      // pieces to lock on top gsmeover
      if(this.y + r < 0) {
        alert('Game over')
        // stop animation frame
        gameOver = true
        break
      }
      board[this.y+r][this.x+c] = this.color
    }
  }
  // remove the completed row
  for(let r = 0; r < ROW; r++) {
    let isRowFull = true
    for(let c = 0; c < COL; c++) {
      isRowFull = isRowFull && (board[r][c] !== VACANT)
    }
    if(isRowFull) {
      // if row is full
      // we move down all rows above
      for( let y = r; y > 1; y-- ) {
        for (let c = 0; c < COL; c++) {
          board[y][c] = board[y-1][c]
        }
      }
      // the top row board[0][..] has no row above it
      for (let c = 0; c < COL; c++) {
        board[0][c] = VACANT
      }
      score += 10
    }
  }
  // update the board
  drawBoard()
  // update score
  scoreEl.innerHTML = score
}

// collision funcion

Piece.prototype.collision = function(x, y, piece) {
  for(let r = 0; r < piece.length; r++) {
    for(let c = 0; c < piece.length; c++){
      // if square is empty we skip it
      if(!piece[r][c]) {
        continue
      }
      // coordinates of piece after movement
      let newX = this.x + c + x
      let newY = this.y + r + y

      // conditions
      if(newX < 0 || newX >= COL || newY >= ROW) {
        return true
      }
      // skip newY < 0; board[-1] will crash game
      if(newY < 0) {
        continue
      }
      // check if there is a piece already locked
      if(board[newY][newX] !== VACANT){
        return true
      }
    }
  }
  return false
}

// control the piece

document.addEventListener('keydown', CONTROL)

function CONTROL(e) {
  if(e.keyCode === 37) {
    p.moveLeft()
    dropStart = Date.now()
  } else if (e.keyCode === 38) {
    p.rotate()
    dropStart = Date.now()
  } else if (e.keyCode === 39) {
    p.moveRight()
    dropStart = Date.now()
  } else if (e.keyCode === 40) {
    p.moveDown()
    dropStart = Date.now()
  }
}

let dropStart = Date.now()
let gameOver = false
function drop() {
  let now = Date.now()
  let delta = now - dropStart
  if(delta > 500){
    p.moveDown()
    dropStart = Date.now()

  }
  if (!gameOver) {
    requestAnimationFrame(drop)
  }
}

drop()
