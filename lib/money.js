/*jslint node:true, indent: 2 */

(function () {
  'use strict';

  function Currency(name, fractionDigits) {
    if (typeof name !== 'string') {
      throw new Error('Currency: First argument is not a string');
    }
    if (typeof fractionDigits !== 'number') {
      throw new Error('Currency: Second argument is not a number');
    }

    this.code = name;
    this.centFactor = Math.pow(10, fractionDigits);
  }

  function Money(amount, currency) {
    if (typeof amount !== 'number') {
      throw new Error('Money: First argument is not a number');
    }
    if (typeof currency !== 'object' || currency.constructor.name !== 'Currency') {
      throw new Error('Money: Second argument is not a currency object');
    }

    this.currency = currency;
    this.amount = Math.round(amount * this.currency.centFactor);
  }

  function internalMoneyFactory(amount, currency) {
    var money = new Money(0, currency);
    money.amount = amount;

    return money;
  }

  Money.prototype.add = function (money) {
    if (typeof money !== 'object' || money.constructor.name !== 'Money') {
      throw new Error('Money.add: Argument is not a Money object');
    }
    if (money.currency.code !== this.currency.code) {
      throw new Error('Money.add: Currencies differ');
    }

    return internalMoneyFactory(this.amount + money.amount, this.currency);
  };

  Money.prototype.sub = function (money) {
    if (typeof money !== 'object' || money.constructor.name !== 'Money') {
      throw new Error('Money.sub: Argument is not a Money object');
    }
    if (money.currency.code !== this.currency.code) {
      throw new Error('Money.sub: Currencies differ');
    }

    return internalMoneyFactory(this.amount - money.amount, this.currency);
  };

  Money.prototype.mult = function (factor) {
    if (typeof factor !== 'number') {
      throw new Error('Money.mult: Argument is not a number');
    }

    return internalMoneyFactory(Math.round(this.amount * factor), this.currency);
  };

  Money.prototype.toNumber = function () {
    return this.amount / this.currency.centFactor;
  };

  Money.prototype.allocate = function (weights) {
    var i,
      total = 0,
      remainder = this.amount,
      allocation = [];

    for (i = 0; i < weights.length; i += 1) {
      total += weights[i];
    }
    for (i = 0; i < weights.length; i += 1) {
      allocation.push(internalMoneyFactory(Math.floor(this.amount * weights[i] / total), this.currency));
      remainder -= allocation[allocation.length - 1].amount;
    }
    for (i = 0; remainder > 0; i += 1) {
      allocation[i].amount += 1;
      remainder -= 1;
    }

    return allocation;
  };

  var EUR = new Currency('EUR', 2),
    USD = new Currency('USD', 2),
    BTC = new Currency('BTC', 5);

  module.exports = {
    Money: Money,
    Currency: Currency,
    EUR: EUR,
    USD: USD,
    BTC: BTC,
    dollar: function (amount) {
      return new Money(amount, module.exports.USD);
    },
    euro: function (amount) {
      return new Money(amount, module.exports.EUR);
    },
    bitcoin: function (amount) {
      return new Money(amount, module.exports.BTC);
    }
  };
}());
