const { abs, min, max } = Math

/**
 * @param {number} number
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
function clamp (number, low, high) {
  if (!number) {
    // We sometimes have some undefined values.
    return low
  }
  return max(low, min(number, high))
}

const symbolMap = [
  240, // background color
  222,
  125, // dark point
  112, // very dark point
  162,
  177,
  120, // dark point
  208,
  200,
  172,
  196,
  118, // vary dark point
  132,
  147,
  171
]

// Arrays don't support negative values, but they do support indexed lookups.
// Add special definitions here.
symbolMap['-2'] = 127 // end
symbolMap['-1'] = 128 // start

// BMP header info
const headerSize = 14
const dibHeaderSize = 40
const pixelDataOffset = headerSize + dibHeaderSize

/**
 *
 * @param {Object} randomartBoardState
 * @param {boolean} darkMode
 * @return {Buffer}
 */
function generateBitmap (
  randomartBoardState, darkMode = false
) {
  const { board } = randomartBoardState
  const { width, height } = randomartBoardState.bounds
  const dataSize = width * height * 3 // 3 bytes per pixel (RGB)
  const totalFileSize = headerSize + dibHeaderSize + dataSize

  const buffer = Buffer.alloc(totalFileSize)

  // File header (14 bytes)
  buffer.writeUInt16LE(0x4D42, 0) // Signature 'BM'
  buffer.writeUInt32LE(totalFileSize, 2) // File size
  buffer.writeUInt32LE(0, 6) // Reserved
  buffer.writeUInt32LE(0, 8) // Reserved
  buffer.writeUInt32LE(pixelDataOffset, 10) // Image data location

  // DIB header (Bitmap Information Header) (40 bytes)
  buffer.writeUInt32LE(dibHeaderSize, 14) // Header size
  buffer.writeUInt32LE(width, 18) // Image width
  buffer.writeInt32LE(-height, 22) // Image height (negative for top-down)
  buffer.writeUInt16LE(1, 26) // Color planes (must be 1)
  buffer.writeUInt16LE(24, 28) // Bits per pixel (24-bit color)
  buffer.writeUInt32LE(0, 30) // Compression method (0 for uncompressed)
  buffer.writeUInt32LE(dataSize, 34) // Size of raw bitmap data
  buffer.writeUInt32LE(2835, 38) // Horizontal resolution (2835 pixels per meter)
  buffer.writeUInt32LE(2835, 42) // Vertical resolution (2835 pixels per meter)
  buffer.writeUInt32LE(0, 46) // Number of colors in palette (0 for 2^n default)
  buffer.writeUInt32LE(0, 50) // Number of important colors (usually ignored)

  // Pixel data (RGB)
  const offset = headerSize + dibHeaderSize
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      let shade = symbolMap[board[y][x]]
      // Image hacking is a thing. Clamp that shit to at least 0,255 if you
      // decide you dislike the reduced contrast here.
      if (darkMode) {
        shade = clamp(abs(shade - 255), 16, 132)
      } else {
        shade = clamp(shade, 118, 255)
      }

      const pixelOffset = offset + (y * width + x) * 3
      buffer.writeUInt8(shade, pixelOffset) // blue channel
      buffer.writeUInt8(shade, pixelOffset + 1) // green channel
      buffer.writeUInt8(shade, pixelOffset + 2) // red channel
    }
  }

  return buffer
}

module.exports = {
  generateBitmap
}
