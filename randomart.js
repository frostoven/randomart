const _ = require('lodash')
const crypto = require('crypto')

const defaultSymbols = {
  '-2': 'E', // end
  '-1': 'S', // start
  '0': ' ',
  '1': '.',
  '2': 'o',
  '3': '+',
  '4': '=',
  '5': '*',
  '6': 'B',
  '7': 'O',
  '8': 'X',
  '9': '@',
  '10': '%',
  '11': '&',
  '12': '#',
  '13': '/',
  '14': '^',
}

const special = {
  end: -2,
  start: -1,
  empty: 0,
}

const defaultBounds = {
  width: 17,
  height: 9,
}

function createBoard (bounds, value) {
  const result = []

  for (let i = 0; i < bounds.width; i++) {
    result[i] = []
    for (let j = 0; j < bounds.height; j++) {
      result[i][j] = value
    }
  }

  return result
}

function generateBoard (data, options) {
  options = options || {}
  const bounds = options.bounds || defaultBounds

  const board = createBoard(bounds, special.empty)

  let x = Math.floor(bounds.width / 2)
  let y = Math.floor(bounds.height / 2)

  board[x][y] = special.start

  _.each(data, function (b) {
    for (let s = 0; s < 8; s += 2) {
      let d = (b >> s) & 3

      switch (d) {
        case 0: // up
        case 1:
          if (y > 0) y--
          break
        case 2: // down
        case 3:
          if (y < (bounds.height - 1)) y++
          break
      }
      switch (d) {
        case 0: // left
        case 2:
          if (x > 0) x--
          break
        case 1: // right
        case 3:
          if (x < (bounds.width - 1)) x++
          break
      }

      if (board[x][y] >= special.empty) board[x][y]++
    }
  })

  board[x][y] = special.end

  return {
    board: board,
    bounds: bounds,
  }
}

function boardToString (board, options) {
  options = options || {}
  const symbols = options.symbols || defaultSymbols

  let width = board.bounds.width
  let height = board.bounds.height

  const result = []

  for (let i = 0; i < height; i++) {
    result[i] = []
    for (let j = 0; j < width; j++) {
      result[i][j] = symbols[board.board[j][i]] || symbols[special.empty]
    }
    result[i] = result[i].join('')
  }

  return result.join('\n')
}

function randomart (data, options, returnRawData = false) {
  data = data || crypto.pseudoRandomBytes(16)
  options = options || {}

  if (returnRawData) {
    return generateBoard(data, options)
  }
  else {
    return boardToString(generateBoard(data, options), options)
  }
}

module.exports = randomart
