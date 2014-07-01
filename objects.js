
// Question Template
// This would be passed in from the UI
var Templates = [
  {
    question: 'x * y - z = ?',
    limits: {
      x: {
        min: 1,
        max: 5
      },
      y: {
        min: 6,
        max: 10
      },
      z: {
        min: 11,
        max: 15
      }
    }
  },
  {
    question: 'z - y + x = ?',
    limits: {
      x: {
        min: 100,
        max: 200
      },
      y: {
        min: 500,
        max: 1000
      },
      z: {
        min: 1000,
        max: 5000
      }
    }
  },
];

var Alphabet = [
  'a','b','c','d','e','f','g',
  'h','i','j','k','l','m','n',
  'o','p','q','r','s','t','u',
  'v','w','x','y','z'
];

var Operators = [ '+', '-', '*' ];