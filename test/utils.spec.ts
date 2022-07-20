
/// var utils = require('../public/src/utils/utils').utils;
import utils from "../public/src/utils/utils";
import {assert} from "chai";

describe("utils.isInteger", () => {
    it("should test string", () => {
        assert.equal(utils.isInteger("foo"), false);
        assert.equal(utils.isInteger(""), false);
    });
    it ("should test some edge case", () => {
        assert.equal(utils.toInteger(""), 0);
        assert.equal(utils.toInteger("abcd"), 0);
        assert.equal(utils.toInteger(undefined), 0);
        assert.equal(0 ? true: false, false);
        assert.equal(Number.isNaN(Number('100px')), true);
        assert.equal(parseInt('100px'), 100);        
    });
});
