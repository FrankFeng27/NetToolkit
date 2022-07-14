
/// import UserLogin from "./userlogin";
var UserLogin = require('./userlogin-exporter');

module.exports = function setup(options, imports, register) {
    let db = imports.dataaccessor;
    let cu = imports.commUtils;
    var user = new UserLogin(db, cu);
    register(null, {login: user});
};
