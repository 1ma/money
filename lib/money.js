/*jslint node:true, indent: 2 */
'use strict';

var assert = require('assert');

/**
 * Represents a currency.
 *
 * @constructor
 * @param {string} name - An ISO 4217 currency codename.
 * @param {number} fractionDigits - An integer denoting the number of digits in the fractional part of the currency.
 * @throws {RangeError} Will throw a RangeError when fractionDigits is less than zero. 
 */
function Currency(name, fractionDigits) {
  if (fractionDigits < 0) {
    throw new RangeError('fractionDigits must be greater than or equal to 0');
  }

  this.code = name;
  this.centFactor = Math.pow(10, fractionDigits);
}

/**
 * Represents an arbitrary amount of money in a certain currency.
 *
 * @constructor
 * @param {number} amount - The amount of money.
 * @param {Currency} currency - The currency of the money.
 */
function Money(amount, currency) {
  this.currency = currency;
  this.amount = Math.round(amount * this.currency.centFactor);
}

/**
 * A helper money factory for internal use only.
 *
 * @private
 */
function mint(amount, currency) {
  var money = new Money(0, currency);
  money.amount = amount;

  return money;
}

/**
 * Adds two money objects to each other.<br>
 * Note that the method does not modify the implicit object's state, but rather returns another Money object.
 *
 * @param {Money} money - A money object.
 * @returns {Money}
 * @throws {TypeError} Will throw a TypeError when the money parameter and the implicit object have different currencies.
 */
Money.prototype.add = function (money) {
  try {
    assert.deepEqual(this.currency, money.currency);
  } catch (err) {
    throw new TypeError('Currencies differ');
  }

  return mint(this.amount + money.amount, this.currency);
};

/**
 * Subtracts two money objects from each other.<br>
 * Note that the method does not modify the implicit object's state, but rather returns another Money object.
 *
 * @param {Money} money - A money object.
 * @returns {Money}
 * @throws {TypeError} Will throw a TypeError when the money parameter and the implicit object have different currencies.
 */
Money.prototype.sub = function (money) {
  try {
    assert.deepEqual(this.currency, money.currency);
  } catch (err) {
    throw new TypeError('Currencies differ');
  }

  return mint(this.amount - money.amount, this.currency);
};

/**
 * Returns the product between the money amount and a regular number.<br>
 * Useful for discounting taxes, fees and whatnot.
 *
 * @param {number} factor
 * @returns {Money}
 */
Money.prototype.mult = function (factor) {
  return mint(Math.round(this.amount * factor), this.currency);
};

/**
 * Returns the implicit object's money amount as a native JS number.
 *
 * @returns {number}
 */
Money.prototype.toNumber = function () {
  return this.amount / this.currency.centFactor;
};

/**
 * Divides the money according to the input array.
 *
 * @param {array} weights - An array of numbers.
 * @returns {array} An array of Money objects.
 * @throws {RangeError} Will throw a RangeError when any of the numbers in the weights array is less than zero.
 * @throws {RangeError} Will throw a RangeError when the sum of the numbers in the weights array equals zero or the array is empty.
 */
Money.prototype.allocate = function (weights) {
  var i,
    total = 0,
    self = this,
    remainder = this.amount,
    allocation = [];

  weights.forEach(function (weight) {
    if (weight < 0) {
      throw new RangeError('All weights must be greater than or equal to 0');
    }

    total += weight;
  });
  
  if (0 === total) {
    throw new RangeError('The sum of all weights must be greater than 0');
  }
  
  weights.forEach(function (weight) {
    allocation.push(
      mint(
        Math.floor(self.amount * (weight / total)),
        self.currency
      )
    );
    remainder -= allocation[allocation.length - 1].amount;
  });
  
  for (i = 0; remainder > 0; i += 1) {
    allocation[i].amount += 1;
    remainder -= 1;
  }

  return allocation;
};

// A ready-made collection of common currencies
// available through the module's interface.
var USD = new Currency('USD', 2),
  EUR = new Currency('EUR', 2),
  GBP = new Currency('GBP', 2),
  JPY = new Currency('JPY', 0),
  XBT = new Currency('XBT', 8);

/**
 * The money module.
 *
 * @author Marcel Hernandez Bertran <e6990620@gmail.com>
 * @version 0.1.0
 */
module.exports = {
  Money: Money,
  Currency: Currency,
  EUR: EUR,
  USD: USD,
  GBP: GBP,
  JPY: JPY,
  XBT: XBT,
  dollar: function (amount) {
    return new Money(amount, module.exports.USD);
  },
  euro: function (amount) {
    return new Money(amount, module.exports.EUR);
  },
  pound: function (amount) {
    return new Money(amount, module.exports.GBP);
  },
  yen: function (amount) {
    return new Money(amount, module.exports.JPY);
  },
  bitcoin: function (amount) {
    return new Money(amount, module.exports.XBT);
  }
};
