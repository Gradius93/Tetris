const cvs = document.getElementById('tetris')
const ctx = cvs.getContext('2d')

const ROW = 20
const COL = COLUMN = 10
const SQ = squareSize = 20
const VACANT = 'WHITE'

// draw a square

function drawSquare(x,y,color) {
  ctx.fillStyle = color
  ctx.fillRect(x*SQ,y*SQ,SQ,SQ)

  ctx.StrokeStyle = 'BLACK'
  ctx.strokeRect(x*SQ,y*SQ,SQ,SQ)

}

// create the board

let board = []
for( let r = 0; r < ROW; r++){
  board[r] = []
  for(let c = 0; c < COL;c++){
    board[r][c] = VACANT
  }
}

// drawSquare(0,0,'red')
