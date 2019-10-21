const assert = require('assert');
const MessageDictionary = require('../src/message-dictionary');

describe('config test', function() {
    
    it('allow empty config', function() {
        var msg = new MessageDictionary();
        assert.equal(msg.locale,'en');
    });
    
    it('config must be an object', function() {
        assert.throws(function(){
            var msg = new MessageDictionary([]);
        },Error);
    });

    it('config must be hasOwnProperty',function(){
        const config = Object.create({name: 'inherited'})
        var msg = new MessageDictionary(config);
        assert.equal(msg.locale,'en');
        assert.equal(msg.dirPath,'locales');
        assert.equal(msg.namespace,'app');
    });

    it('check default config', function() {
        var msg = new MessageDictionary();
        assert.equal(msg.locale,'en');
        assert.equal(msg.dirPath,'locales');
        assert.equal(msg.namespace,'app');
    });

    it('change default config', function() {
        var msg = new MessageDictionary({
            locale:'id',
            dirPath:'locales/api',
            namespace:'error'
        });
        assert.equal(msg.locale,'id');
        assert.equal(msg.dirPath,'locales/api');
        assert.equal(msg.namespace,'error');
    });

});