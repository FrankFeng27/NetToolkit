
var assert = require('assert');

/// var print = console.log;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it('should test Array.prototype.sort', () => {
      let arr: string[] = ['/temporary~88696778', '/memos/2022/20220822', '/temporary~48065225', '/temporary~91575218'];
      arr.sort();
      console.log(arr);
    });
  });
});

describe('Primitive Types', function () {
  it('should check primitive types', function () {
    var tp = typeof null;
    assert.equal(tp, 'object');
    tp = typeof function () {};
    assert.equal(tp, 'function');
    tp = typeof '';
    assert.equal(tp, 'string');
    tp = typeof 10.0;
    assert.equal(tp, 'number');
    tp = typeof [];
    assert.equal(tp, 'object');
    var undef_var;
    tp = typeof undef_var;
    assert.equal(tp, 'undefined');
    /// tp = typeof doesnotExist;
    /// assert.equal(tp, 'undefined');
    var null_var = null;
    tp = typeof null_var;
    assert.equal(tp, 'object');
    var obj = {};
    tp = typeof obj;
    assert.equal(tp, 'object');
    var float_num = 10.1234;
    tp = typeof float_num;
    assert.equal(tp, 'number');
    assert.equal(Number.isInteger(float_num), false);
    tp = typeof (() => {});
    assert.equal(tp, 'function');
  });
  it ('should do some checks for NaN.', function () {
    var myCatsAge = Number('n/a'); // NaN
    assert(!(myCatsAge === myCatsAge)); // NaN not equal to each other
    var undef_obj;
    assert(undef_obj === undef_obj); // undefined equal to each other
    assert(isNaN(myCatsAge)); // true
    /// assert(isNaN('my cats age')); // ture OOPS
    assert(Number.isNaN(myCatsAge)); // true
    /// assert(!Number.isNaN('my cats age')); // false, Number.isNaN() precise check
    assert(undef_obj === undefined);
    assert(typeof undef_obj === 'undefined');
  });
  it ('should test parseInt', () => {
    var val = parseInt('123abcd');
    console.log(val);
    val = parseInt('askdjfkajs');
    console.log(val);
  });
});

describe('boolean values', function () {
  it('should test what value would be considered as false', () => {
    assert.equal("" ? true : false, false);
    assert.equal(0 ? true : false, false);
  });
});


describe('interface', function () {
  it('should test interface', () => {
    interface NumberDictionary {
      [index: string]: number;
      length: number;
      name: number;
    }
  });
});

