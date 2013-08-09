var assert = require('assert')
  , money  = require('../lib-cov/money');

var Money    = money.Money
  , Currency = money.Currency
  , EUR      = money.EUR
  , USD      = money.USD
  , BTC      = money.BTC;

suite('Currency tests', function() {

  suite('Construction tests', function() {

    test('new Currency: expected usage', function() {
      var c = new Currency('USD', 2);
      assert.equal(c.code, 'USD');
      assert.equal(c.centFactor, 100);
    });

    test('new Currency: invalid parameter, take 1 (1st argument not a string)', function() {
      assert.throws(function() {
        var m0 = new Currency(123, 456);
      }, Error);
    });

    test('new Currency: invalid parameter, take 2 (2nd argument not a number)', function() {
      assert.throws(function() {
        var m0 = new Currency('hello', 'world');
      }, Error);
    });

  });

});

suite('Money tests', function() {

  suite('Construction tests', function() {

    test('new Money: expected usage', function() {
      var m0 = new Money(0.12345, BTC);
      assert.equal(m0.amount, 12345);
      assert.equal(m0.currency.code, 'BTC');
      assert.equal(m0.currency.centFactor, 100000);
    });

    test('new Money: invalid parameter, take 1 (1st argument not a number)', function() {
      assert.throws(function() {
        var m0 = new Money(BTC, 3);
      }, Error);
    });

    test('new Money: invalid parameter, take 2 (2nd argument not a Currency object)', function() {
      assert.throws(function() {
        var m0 = new Money(123.45, [1,2,3]);
      }, Error);
    });

  });

  suite('Arithmetic tests', function() {

    test('.add: expected usage, take 1', function() {
      var m0 = new Money(0.12345, BTC)
        , m1 = new Money(0.54321, BTC)
        , m2 = m0.add(m1);
      assert.equal(m2.amount, 66666);
    });

    test('.add: expected usage, take 2', function() {
      var m0 = new Money(-0.12345, BTC)
        , m1 = new Money(0.54321, BTC)
        , m2 = m0.add(m1);
      assert.equal(m2.amount, 41976);
    });

    test('.add: invalid parameter, take 1 (not an object)', function() {
      var m0 = new Money(0.12345, BTC);
      assert.throws(function() {
        return m0.add(3.14159);
      }, Error);
    });

    test('.add: invalid parameter, take 2 (not a Money object)', function() {
      var m0 = new Money(0.12345, BTC);
      assert.throws(function() {
        return m0.add(new Date());
      }, Error);
    });

    test('.add: invalid parameter, take 3 (different currency)', function() {
      var m0 = new Money(0.12345, BTC)
        , m1 = new Money(13.37, USD);
      assert.throws(function() {
        return m0.add(m1);
      }, Error);
    });

    test('.sub: expected usage, take 1', function() {
      var m0 = new Money(0.12345, BTC)
        , m1 = new Money(0.54321, BTC)
        , m2 = m1.sub(m0);
      assert.equal(m2.amount, 41976);
    });

    test('.sub: expected usage, take 2', function() {
      var m0 = new Money(0.12345, BTC)
        , m1 = new Money(-0.54321, BTC)
        , m2 = m1.sub(m0);
      assert.equal(m2.amount, -66666);
    });

    test('.sub: invalid parameter, take 1 (not an object)', function() {
      var m0 = new Money(0.12345, BTC);
      assert.throws(function() {
        return m0.sub(3.14159);
      }, Error);
    });

    test('.sub: invalid parameter, take 2 (not a Money object)', function() {
      var m0 = new Money(0.12345, BTC);
      assert.throws(function() {
        return m0.sub(new Date());
      }, Error);
    });

    test('.sub: invalid parameter, take 3 (different currency)', function() {
      var m0 = new Money(0.12345, BTC)
        , m1 = new Money(10.01, EUR);
      assert.throws(function() {
        return m0.sub(m1);
      }, Error);
    });

    test('.mult: expected usage, take 1', function() {
      var m0 = new Money(0.12345, BTC)
        , s0 = 1.05
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, 12962);
    });

    test('.mult: expected usage, take 2', function() {
      var m0 = new Money(0.12345, BTC)
        , s0 = 0.33
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, 4074);
    });

    test('.mult: expected usage, take 3', function() {
      var m0 = new Money(0.12345, BTC)
        , s0 = -1.45
        , m1 = m0.mult(s0);
      assert.equal(m1.amount, -17900);
    });

    test('.mult: invalid parameter, take 1 (not a number)', function() {
      var m0 = new Money(0.12345, BTC);
      assert.throws(function() {
        return m0.mult(USD);
      }, Error);
    });

    test('.allocate: expected usage, take 1 (Matt Foemmel\'s conundrum)' , function() {
      var m0 = new Money(0.05, USD)
        , list = m0.allocate([3,7]);
      assert.equal(list[0].amount, 2);
      assert.equal(list[1].amount, 3);
    });

    test('.allocate: expected usage, take 2', function() {
      var m0 = new Money(0.12345, BTC)
        , list = m0.allocate([4,3,2,1]);
      assert.equal(list[0].amount, 4939);
      assert.equal(list[1].amount, 3703);
      assert.equal(list[2].amount, 2469);
      assert.equal(list[3].amount, 1234);
    });

  });

  suite('Other tests', function() {

    test('.toNumber', function() {
      var c0 = new Currency('ESP', 1)
        , m0 = new Money(0.12345, BTC)
        , m1 = new Money(62366463, c0)
        , m2 = new Money(843.32485, BTC)
        , m3 = new Money(8764674.38, EUR);
      assert.equal(m0.toNumber(), 0.12345);
      assert.equal(m1.toNumber(), 62366463);
      assert.equal(m2.toNumber(), 843.32485);
      assert.equal(m3.toNumber(), 8764674.38);
    });

    test('common currency wrappers', function() {
      var m0 = money.euro(0.12)
        , m1 = money.dollar(0.12)
        , m2 = money.bitcoin(0.12345);
      assert.equal(m0.amount, 12);
      assert.equal(m0.currency.code, 'EUR');
      assert.equal(m0.currency.centFactor, 100);
      assert.equal(m1.amount, 12);
      assert.equal(m1.currency.code, 'USD');
      assert.equal(m1.currency.centFactor, 100);
      assert.equal(m2.amount, 12345);
      assert.equal(m2.currency.code, 'BTC');
      assert.equal(m2.currency.centFactor, 100000);
    });

  });

});