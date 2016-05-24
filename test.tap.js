var assert = require("assert");
var randomart = require("./randomart.js")

describe("randomart", function() {
  describe("should generate the right randomart", function() {
    var test = function(input, output) {
      assert.equal(randomart(input), output);
    }

    it("first test case", function() {
      var input = [
        0x9b, 0x4c, 0x7b, 0xce,
        0x7a, 0xbd, 0x0a, 0x13,
        0x61, 0xfb, 0x17, 0xc2,
        0x06, 0x12, 0x0c, 0xed,
      ];

      var output = [
        "    .+.          ",
        "      o.         ",
        "     .. +        ",
        "      Eo =       ",
        "        S + .    ",
        "       o B . .   ",
        "        B o..    ",
        "         *...    ",
        "        .o+...   ",
      ].join("\n");

      test(input, output);
    });
    it("second test case", function() {
      var input = [
        0x30, 0xaa, 0x88, 0x72,
        0x7d, 0xc8, 0x30, 0xd0,
        0x2b, 0x99, 0xc7, 0x8f,
        0xd1, 0x86, 0x59, 0xfc,
      ];

      var output = [
        "                 ",
        " . .             ",
        ". . o o          ",
        " = * o o         ",
        "+ X + E S        ",
        ".+ @ .           ",
        "+ + = .          ",
        "..   .           ",
        "                 ",
      ].join("\n");

      test(input, output);
    })
  });
});
