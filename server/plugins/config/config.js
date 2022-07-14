
"use strict";
var path = require('path');
var convict = require('convict');

class NetToolkitConfig {
    constructor(cfg) {
        this.convict = new convict({});
        if (typeof cfg === 'string') {
            var conf = require(cfg);
            this.convict.load(conf);
        } else if (typeof cfg === 'object') {// array
            cfg.forEach(item => {
                var conf = require(item);
                this.convict.load(conf);
            });
        }
    }
    get(name) {
        return this.convict.get(name);
    }
    set(name, value) {
        this.convict.set(name, value);
    }
}

module.exports = function setup(options, imports, register) {
    var config = new NetToolkitConfig(options['config-path']);

    register(null, {
        config: config
    })
};

