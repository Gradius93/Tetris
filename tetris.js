const cvs = document.getElementById('tetris')
const ctx = cvs.getContext('2d')

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

let p = new Piece(PIECES[0][0],PIECES[0][1])

// The object piece

function Piece(tetromino, color) {
  this.tetromino = tetromino
  this.color = color

  this.tetrominoN = 0
  this.activeTetromino = this.tetromino[this.tetrominoN]

  this.x = 4
  this.y = 0
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
  this.unDraw()
  this.y++
  this.draw()
}

// move right

Piece.prototype.moveRight = function() {
  this.unDraw()
  this.x++
  this.draw()
}

// move left

Piece.prototype.moveLeft = function() {
  this.unDraw()
  this.x--
  this.draw()
}

// rotate

Piece.prototype.rotate = function() {
  this.unDraw()
  this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length
  this.activeTetromino = this.tetromino[this.tetrominoN]
  this.draw()
}

// collision check

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
    }
  }
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
function drop() {
  let now = Date.now()
  let delta = now - dropStart
  if(delta > 500){
    p.moveDown()
    dropStart = Date.now()

  }
  requestAnimationFrame(drop)
}

drop()
