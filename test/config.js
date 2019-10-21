const assert = require('assert');
const MessageDictionary = require('../src/message-dictionary');
const path = require('path');

describe('config test', function() {

    var config = {
        dirPath: path.join('./locales')
    }
    
    it('not allow empty config', function() {
        assert.throws(function(){
            var msg = new MessageDictionary();
        },Error);
    });
    
    it('config must be an object', function() {
        assert.throws(function(){
            var msg = new MessageDictionary([]);
        },Error);
    });

    it('config must be hasOwnProperty',function(){
        const configs = Object.create({
            name: 'inherited',
            dirPath: path.join('./locales')
        });
        var msg = new MessageDictionary(configs);
        assert.equal(msg.locale,'en');
        assert.equal(msg.namespace,'app');
    });

    it('check default config', function() {
        var msg = new MessageDictionary(config);
        assert.equal(msg.locale,'en');
        assert.equal(msg.namespace,'app');
    });

    it('change default config', function() {
        var msg = new MessageDictionary({
            locale:'id',
            dirPath:path.join('./locales/api'),
            namespace:'error'
        });
        assert.equal(msg.locale,'id');
        assert.equal(msg.dirPath.endsWith('api'),true);
        assert.equal(msg.namespace,'error');
    });

});