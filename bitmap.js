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
 Loosely mimics Node's Buffer.writeUInt8.
 * @param {ArrayBuffer} buffer
 * @param {number} value
 * @param {number} offset
 */
function writeUInt8 (buffer, value, offset) {
  const dataView = new DataView(buffer)
  dataView.setUint8(offset, value)
}

/**
 * Loosely mimics Node's Buffer.writeUInt16LE.
 * @param {ArrayBuffer} buffer
 * @param {number} value
 * @param {number} offset
 */
function writeUInt16LE (buffer, value, offset) {
  const dataView = new DataView(buffer)
  dataView.setUint16(offset, value, true)
}

/**
 * Loosely mimics Node's Buffer.writeUInt32LE.
 * @param {ArrayBuffer} buffer
 * @param {number} value
 * @param {number} offset
 */
function writeUInt32LE (buffer, value, offset) {
  const dataView = new DataView(buffer)
  dataView.setUint32(offset, value, true)
  // return dataView.getFloat32(0);
}

/**
 * Loosely mimics Node's Buffer.writeInt32LE.
 * @param {ArrayBuffer} buffer
 * @param {number} value
 * @param {number} offset
 */
function writeInt32LE (buffer, value, offset) {
  const dataView = new DataView(buffer)
  dataView.setInt32(offset, value, true)
}

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

  const buffer = new ArrayBuffer(totalFileSize)

  // File header (14 bytes)
  writeUInt16LE(buffer, 0x4D42, 0) // Signature 'BM'
  writeUInt32LE(buffer, totalFileSize, 2) // File size
  writeUInt32LE(buffer, 0, 6) // Reserved
  writeUInt32LE(buffer, 0, 8) // Reserved
  writeUInt32LE(buffer, pixelDataOffset, 10) // Image data location

  // DIB header (Bitmap Information Header) (40 bytes)
  writeUInt32LE(buffer, dibHeaderSize, 14) // Header size
  writeUInt32LE(buffer, width, 18) // Image width
  writeInt32LE(buffer, -height, 22) // Image height (negative for top-down)
  writeUInt16LE(buffer, 1, 26) // Color planes (must be 1)
  writeUInt16LE(buffer, 24, 28) // Bits per pixel (24-bit color)
  writeUInt32LE(buffer, 0, 30) // Compression method (0 for uncompressed)
  writeUInt32LE(buffer, dataSize, 34) // Size of raw bitmap data
  writeUInt32LE(buffer, 2835, 38) // Horizontal resolution (2835 pixels per meter)
  writeUInt32LE(buffer, 2835, 42) // Vertical resolution (2835 pixels per meter)
  writeUInt32LE(buffer, 0, 46) // Number of colors in palette (0 for 2^n default)
  writeUInt32LE(buffer, 0, 50) // Number of important colors (usually ignored)

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
      writeUInt8(buffer, shade, pixelOffset) // blue channel
      writeUInt8(buffer, shade, pixelOffset + 1) // green channel
      writeUInt8(buffer, shade, pixelOffset + 2) // red channel
    }
  }

  return new Uint8Array(buffer)
}

module.exports = {
  generateBitmap
}
