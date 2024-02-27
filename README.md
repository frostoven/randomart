randomart-generator
====

Generate OpenSSH style "randomart" images based on any data.

This is a shameless, cli port of
[slapresta/randomart](https://github.com/slapresta/randomart),
which is itself a shameless, slightly modified port of
[calmh/randomart](https://github.com/calmh/randomart) to JS,
which is a shameless, modified version of
[therebelrobot](https://github.com/therebelrobot/randomart) that adds new
features. <!-- This chain is getting ridiculous XD -->

About this fork
===

Adds the option to return the board state as an array instead of a string.
Great for situations where raw values are useful (such as when generating
images). Just add `true` as the third argument to the `randomart()` function.

This fork also removes some dependencies and updates others.

Example
====

```javascript

randomart = require('randomart');

console.log(randomart([
  0x9b, 0x4c, 0x7b, 0xce, 0x7a, 0xbd, 0x0a, 0x13,
  0x61, 0xfb, 0x17, 0xc2, 0x06, 0x12, 0x0c, 0xed
]));
```

```
    .+.
      o.
     .. +
      Eo =
        S + .
       o B . .
        B o..
         *...
        .o+...
```

Documentation
====

The function returned by `require('randomart')` optionally accepts two
arguments: the first one, `data`, is expected to be an array of integers
between 0 and 255, while the second one, `options`, has the following
structure, in which all parent elements are optional:

```javascript
randomart = require('randomart')

const options = {
  bounds: {
    width: 17,
    height: 9,
  },
  symbols: {
    '-2': 'E',
    '-1': 'S',
    '0': ' ',
    '1': '.',
    // [...]
    '13': '/',
    '14': '^',
  },
  getRawData: false,
}

const randomartString = randomart(
  [/* your byte array */],
  options,
)
```

Credits
====

Thanks to [@calmh](https://github.com/calmh/randomart) for their hard work! May
the opensource gods reward them with seventy-two non-terrible window managers.
