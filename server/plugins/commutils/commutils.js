
/* jshint node: true */
"use strict";

var _ = require('lodash');
var logger = require('./logger');
var uuidv4 = require('uuid').v4;
var crypto = require('crypto');

// Nodejs encryption with CTR
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function _encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function _decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = function setup (options, imports, register) {
  var api = {
    handleError: function (err) {
      logger.log('error', String(err));
    },
    outputMessage: function (msg_obj) {
      var _msg = msg_obj
      if (_.isString(_msg)) {
        _msg = { type: "info", message: _msg };
      }
      var type = _msg.type ? _msg.type : "info";
      var content = _msg.message ? _msg.message : "";

      logger.log(type, content);
    },
    validateCallback: function (cb) {
      if (typeof cb === 'function') {
        return cb;
      }
      return function () {};
    },
    parseBase64: function (base64) {
      const HEADER_MAX_LENGTH = 32;
      let header = base64.slice(0, HEADER_MAX_LENGTH);
      let pat = null;
      if (base64[11] === '.') {
        pat = /data:image\/\.(\w+);base64,/;
      } else {
        pat = /data:image\/(\w+);base64,/;
      }
      let res = header.match(pat);
      if (res && res[1] && res[1].length > 0) {
        return ['image/'+res[1], res[1], base64.slice(res[0].length)];
      }
      return null; // Can't identify image type.
    }, 
    encrypt: text => (
      _encrypt(text)
    ),
    decrypt: text => (
      _decrypt(text)
    ),
    encryptWithRandomSalt: (pwd, version) => {
      const delimiter = "-+=";
      const ver = "1.1";
      var random_str = uuidv4();
      var sha256 = crypto.createHash('sha256');
      var crypto_str = sha256.update(pwd + delimiter + random_str).digest('hex');
      return {crypto: crypto_str, salt: random_str, delimiter: delimiter, version: ver};
    },
    encryptWithSalt: (pwd, salt, delimiter) => {
      let sha256 = crypto.createHash('sha256');
      var crypto_str = sha256.update(pwd + delimiter + salt).digest('hex');
      return {crypto: crypto_str, salt: salt, delimiter: delimiter};
    }
  };

  register(null, {
    commUtils: api
  });
};





