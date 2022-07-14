
'use strict';
var Expresser = require("./expresser-exporter");

module.exports = function setup(options, imports, register) {
    let userLogin = imports.login;
    let cu = imports.commUtils;
    let dataAccessor = imports.dataaccessor;
    let exp = new Expresser(userLogin, cu, dataAccessor);
    register(null, {express: exp});
};
