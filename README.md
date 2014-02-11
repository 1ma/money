#money

Node.js module to perform precise common money calculations.
This library is a partial javascript implementation of Martin Fowler's [Money Pattern](http://martinfowler.com/eaaCatalog/money.html), as described in his book *Patterns of Enterprise Application Architecture*.


## Using the library

```javascript
var money = require('path/to/lib/money');

// Show me those monies
var inheritance = money.dollar(1234567.89);


// Subtract taxes
var TAXMAN = 0.69;
var netSum = inheritance.mult(TAXMAN);

// netSum      $ 851,851.84


// Hand out loot to heirs. The oldest will receive 40% of the money, the next one 30% etc.
var heirs = netSum.allocate([4,3,2,1]);

// heir[0]:    $ 340.740,74
// heir[1]:    $ 255.555,56
// heir[2]:    $ 170,370.36
// heir[3]:  + $  85,185.18
//            --------------
// sum:        $ 851,851.84 (wow so money much precise)
```

## Running the tests (*nix only)

1. Clone and install [node-jscoverage](https://github.com/visionmedia/node-jscoverage) in your system
2. Enter the money repository and run `jscoverage lib/ lib-cov/` to instrument the library
3. Install [Mocha](http://visionmedia.github.io/mocha) as a command via npm `sudo npm install -g mocha`
  * a. To run the tests write the following command: `mocha --ui tdd test/test.js`
  * b. To view a coverage report use the `html-cov` reporter: `mocha --ui tdd -R html-cov test/test.js > report.html` and open the HTML file with your browser of choice.
