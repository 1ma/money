var assert = require('assert'),
  money    = require('../lib-cov/money'),
  Money    = money.Money,
  Currency = money.Currency,
  EUR      = money.EUR,
  USD      = money.USD,
  XBT      = money.XBT;

suite('Currency tests', function() {
  suite('Constructor tests', function() {
    var testValidCallOnConstructor = function(name, decimals, expectedCentFactor) {
      return function() {
        var fineCurrency = new Currency(name, decimals);
        assert.equal(fineCurrency.code, name);
        assert.equal(fineCurrency.centFactor, expectedCentFactor);
      };
    };

    var testPassBadArgumentToConstructor = function(name, decimals, expectedRegExp) {
      return function() {
        assert.throws(function() {
          var badCurrency = new Currency(name, decimals);
        }, expectedRegExp);
      };
    };

    var dataProvider = [
      ['XBT', 8, 100000000],
      ['USD', 2,       100],
      ['ESP', 0,         1]
    ];

    dataProvider.forEach(function(args, count) {
      test('new Currency: correct usage, take ' + count,
        testValidCallOnConstructor(args[0], args[1], args[2])
      );
    });

    dataProvider = [
      ['LOL', -1]
    ];

    dataProvider.forEach(function(args, count) {
      test('new Currency: incorrect usage, take ' + count,
        testPassBadArgumentToConstructor(
          args[0], args[1],
          /fractionDigits must be greater than or equal to 0/
        )
      );
    });
  });
});

suite('Money tests', function() {
  suite('Construction tests', function() {
    var testValidCallOnConstructor = function(amount, currency, expectedStoredValue) {
      return function() {
        var fineMoney = new Money(amount, currency);
        assert.equal(fineMoney.amount, expectedStoredValue);
        assert.deepEqual(fineMoney.currency, currency);
      }
    }

    var dataProvider = [
      [          0, XBT,          0],
      [ 0.12345678, XBT,   12345678],
      [     10.984, EUR,       1098],
      [     10.985, EUR,       1099],
      [    -892.93, USD,     -89293],
      [-9839529.32, USD, -983952932]
    ];

    dataProvider.forEach(function(args, count){
      test('new Money: correct usage, take ' + count,
        testValidCallOnConstructor(args[0], args[1], args[2])
      );
    });
  });

  suite('Arithmetic tests', function() {

    test('.add: expected usage, take 1', function() {
      var m0 = new Money(0.12345678, XBT)
        , m1 = new Money(0.87654321, XBT)
        , m2 = m0.add(m1);
      assert.equal(m2.amount, 99999999);
    });

    test('.add: expected usage, take 2', function() {
      var m0 = new Money(-0.12345678, XBT)
        , m1 = new Money(0.87654321, XBT)
        , m2 = m0.add(m1);
      assert.equal(m2.amount, 75308643);
    });

    test('.add: invalid parameter, take 1 (different currencies)', function() {
      var m0 = new Money(0.12345, XBT)
        , m1 = new Money(13.37, USD);
      assert.throws(function() {
        return m0.add(m1);
      }, /Currencies differ/);
    });

    test('.sub: expected usage, take 1', function() {
      var m0 = new Money(0.12345, XBT)
        , m1 = new Money(0.54321, XBT)
        , m2 = m1.sub(m0);
      assert.equal(m2.amount, 41976000);
    });

    test('.sub: expected usage, take 2', function() {
      var m0 = new Money(0.12345, XBT)
        , m1 = new Money(-0.54321, XBT)
        , m2 = m1.sub(m0);
      assert.equal(m2.amount, -66666000);
    });

    test('.sub: invalid parameter, take 1 (different currencies)', function() {
      var m0 = new Money(0.12345, XBT)
        , m1 = new Money(10.01, EUR);
      assert.throws(function() {
        return m0.sub(m1);
      }, /Currencies differ/);
    });

    test('.mult: expected usage, take 1', function() {
      var m0 = new Money(0.12345, XBT)
        , s0 = 1.05
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, 12962250);
    });

    test('.mult: expected usage, take 2', function() {
      var m0 = new Money(0.12345, XBT)
        , s0 = 0.33
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, 4073850);
    });

    test('.mult: expected usage, take 3', function() {
      var m0 = new Money(0.12345, XBT)
        , s0 = -1.45
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, -17900250);
    });

    test('.allocate: expected usage, take 1 (Matt Foemmel\'s conundrum)' , function() {
      var m0 = new Money(0.05, USD)
        , list = m0.allocate([3,7]);
      assert.equal(list[0].amount, 2);
      assert.equal(list[1].amount, 3);
    });

    test('.allocate: expected usage, take 2', function() {
      var m0 = new Money(0.12345678, XBT)
        , list = m0.allocate([4,3,2,1]);
      assert.equal(list[0].amount, 4938272);
      assert.equal(list[1].amount, 3703704);
      assert.equal(list[2].amount, 2469135);
      assert.equal(list[3].amount, 1234567);
    });

  });

  suite('Other tests', function() {

    test('.toNumber', function() {
      var c0 = new Currency('ESP', 1)
        , m0 = new Money(0.12345, XBT)
        , m1 = new Money(62366463, c0)
        , m2 = new Money(843.32485, XBT)
        , m3 = new Money(8764674.38, EUR);
      assert.equal(m0.toNumber(), 0.12345);
      assert.equal(m1.toNumber(), 62366463);
      assert.equal(m2.toNumber(), 843.32485);
      assert.equal(m3.toNumber(), 8764674.38);
    });

  });

});
