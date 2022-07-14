
'use strict';

var DatabaseAccessor = require('./dataaccessor-exporter');

module.exports = function setup(options, imports, register) {
    let config = imports.config;
    let commUtils = imports.commUtils;
    let database = new DatabaseAccessor({commUtils: commUtils, config: config});
    database.connect().then(() => {
      register(null, {dataaccessor: database});
    }).catch(err => commUtils.handleError(err));
}

