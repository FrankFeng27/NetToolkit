
/// import { v4 as uuidv4 } from 'uuid';
var v4 = require('uuid').v4;
var uuidv4 = v4;
var assert = require('chai').assert;
var crypto = require('crypto');

describe('uuid - test uuid usage.', () => {
    it ('should test generate random string', () => {
        var random_str = uuidv4();
        random_str = random_str.replace(/-/gi, '');
        assert.equal(random_str.length, 32);
        var crypto_str = crypto.randomBytes(16).toString('hex');
        assert(crypto_str.length, 32);
    });
    it ('should test salt string', () => {
        const delimiter = '-+=';
        var pwd = '123456ww';
        var random_str = uuidv4();
        var sha256 = crypto.createHash('sha256');
        var crypto_str = sha256.update(pwd + delimiter + random_str).digest('hex');
        assert.equal(64, crypto_str.length);
    });
});
