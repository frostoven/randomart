const assert = require('assert')
const { describe, it } = require('node:test')
const randomart = require('./randomart.js')
const { generateBitmap } = require('./bitmap')

describe('randomart', function () {
  describe('should generate the right randomart', function () {
    const test = function (input, output) {
      assert.equal(randomart(input), output)
    }

    it('first test case', function () {
      const input = [
        0x9b, 0x4c, 0x7b, 0xce,
        0x7a, 0xbd, 0x0a, 0x13,
        0x61, 0xfb, 0x17, 0xc2,
        0x06, 0x12, 0x0c, 0xed
      ]

      const output = [
        '    .+.          ',
        '      o.         ',
        '     .. +        ',
        '      Eo =       ',
        '        S + .    ',
        '       o B . .   ',
        '        B o..    ',
        '         *...    ',
        '        .o+...   '
      ].join('\n')

      test(input, output)
    })

    it('second test case', function () {
      const input = [
        0x30, 0xaa, 0x88, 0x72,
        0x7d, 0xc8, 0x30, 0xd0,
        0x2b, 0x99, 0xc7, 0x8f,
        0xd1, 0x86, 0x59, 0xfc
      ]

      const output = [
        '                 ',
        ' . .             ',
        '. . o o          ',
        ' = * o o         ',
        '+ X + E S        ',
        '.+ @ .           ',
        '+ + = .          ',
        '..   .           ',
        '                 '
      ].join('\n')

      test(input, output)
    })

    it('bitmap functions complete', function () {
      const input = [
        0xaa, 0x88, 0x72,
        0xc8, 0x30, 0xd0,
        0x99, 0xc7, 0x8f
      ]

      const expectedOutput = JSON.stringify([
        66, 77, 66, 0, 0, 0, 0, 0, 0, 0, 54, 0,
        0, 0, 40, 0, 0, 0, 2, 0, 0, 0, 254, 255,
        255, 255, 1, 0, 24, 0, 0, 0, 0, 0, 12, 0,
        0, 0, 19, 11, 0, 0, 19, 11, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 132, 132, 132, 127, 127, 127,
        177, 177, 177, 128, 128, 128
      ])

      const board = randomart(input, {
        bounds: {
          width: 2,
          height: 2
        },
        symbols: null,
        getRawData: true
      })

      const data = generateBitmap(board, false)
      assert.equal(JSON.stringify([...data]), expectedOutput)
    })
  })
})
