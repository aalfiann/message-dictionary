const assert = require('assert');
const message = require('../src/message-dictionary');
const path = require('path');

describe('config test', function() {

    var config = {
        dirPath: path.join('./locales')
    }
    
    it('not allow empty config', function() {
        assert.throws(function(){
            message.init();
        },Error);
    });
    
    it('config must be an object', function() {
        assert.throws(function(){
            message.init([]);
        },Error);
    });

    it('config without dirPath', function() {
        assert.throws(function(){
            message.init({
                namespace:'app'
            });
        },Error);
    });

    it('check default config', function() {
        message.init(config);
        assert.equal(message.getDirPath(),'locales');
        assert.equal(message.getNamespace(),'app');
    });

    it('config must be hasOwnProperty',function(){
        const configs = Object.create({
            name: 'inherited',
            dirPath: path.join('./locales')
        });
        message.init(configs);
        assert.equal(message.getNamespace(),'app');
    });

    it('change default config', function() {
        message.init({
            namespace:'test',
            dirPath: path.join('./locales')
        })
        assert.equal(message.getNamespace(),'test');
    });

});