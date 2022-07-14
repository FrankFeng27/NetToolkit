
var assert = require('assert');
var commutils_setup = require('../server/plugins/commutils/commutils');

describe('plugin - commutils', () => {
    var mock_registered_obj = null;
    before(async () => {
        await commutils_setup(null, null, (scriptUrl, obj) => {
            mock_registered_obj = obj.commUtils;
        });
    });

    it ('should test commUtils.encrypt/decrypt', () => {
        let utils = mock_registered_obj;
        const text = "This a test string.";
        let text_crypt = utils.encrypt(text);
        let text_decrypt = utils.decrypt(text_crypt);
        assert.equal(text, text_decrypt);        
    });
});


