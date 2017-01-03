#money

Node.js module to perform precise common money calculations.
This library is a partial javascript implementation of the [Money Pattern](http://martinfowler.com/eaaCatalog/money.html) as described by Martin Fowler in his book *Patterns of Enterprise Application Architecture*.


## Using the library

```javascript
var money = require('path/to/lib/money.js');

// Show me those monies
var inheritance = money.dollar(1234567.89);

// Subtract taxes
var TAXMAN = 0.69;
var netSum = inheritance.mult(TAXMAN);

console.log(netSum.toNumber());
// 851851.84

// Hand out loot to heirs.
// The oldest will receive 40% of the money, the next one 30% etc.
var heirs = netSum.allocate([4,3,2,1]);

heirs.forEach(function(heir) { console.log(heir.toNumber()); });
// 340740.74
// 255555.56
// 170370.36
// 85185.18

var addBack = heirs[0].add(heirs[1]).add(heirs[2]).add(heirs[3]);
assert.deepEqual(addBack, netSum);
// undefined (wow so money much precise)
```

## Running the tests (*nix only)

1. Clone and install [node-jscoverage](https://github.com/visionmedia/node-jscoverage) in your system
2. Enter the money repository and run `jscoverage lib/ lib-cov/` to instrument the library
3. Install [Mocha](http://mochajs.org/) as a command via npm `sudo npm install -g mocha`
  * a. To run the tests execute the following command: `mocha --ui tdd test/test.js`
  * b. To view a coverage report use the `html-cov` reporter: `mocha --ui tdd -R html-cov test/test.js > report.html` and open the HTML file with your browser of choice.
