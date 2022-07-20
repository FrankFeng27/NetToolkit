
var assert = require('assert');
var path = require('path');
var config_setup = require('../server/plugins/config/config');

describe('plugin - config', () => {
    var mock_registered_obj = null;
    before(async () => {
        await config_setup({'config-path': path.join(__dirname, '../config/config.json')}, null, (scriptUrl, obj) => {
            mock_registered_obj = obj.config;
        });
    }); 
    it('should get server port', () => {
        assert(mock_registered_obj);
        assert.equal(mock_registered_obj.get('server_port'), '8080');
    });
});