const assert = require('assert');
const path = require('path');

describe('global or singleton test', function() {
    
    it('create new object then message init and load', function() {
        const message = require('../src/message-dictionary');
        message.init({
            dirPath: path.join('./locales'),
            namespace: 'global'
        }).load();
        assert.deepEqual(message.list(),[]);
    });

    it('add new message with require again', function() {
        const message1 = require('../src/message-dictionary');
        message1.addMessage('007','en','global or singleton test','',function(err, data) {
            assert.deepEqual(message1.list(),[ { code: '007', message: { en: 'global or singleton test' } } ]);
        });
    });

    it('get list message with require again', function() {
        const message2 = require('../src/message-dictionary');
        assert.deepEqual(message2.list(),[ { code: '007', message: { en: 'global or singleton test' } } ]);
    });

    it('get list message with require again', function() {
        const message3 = require('../src/message-dictionary');
        assert.deepEqual(message3.list(),[ { code: '007', message: { en: 'global or singleton test' } } ]);
    });

    it('re-init and load will change globally', function() {
        const message4 = require('../src/message-dictionary');
        message4.init({
            dirPath: path.join('./locales'),
            namespace: 'global2'
        }).load();
        assert.deepEqual(message4.list(),[]);
    });

    it('cleanup global test', function() {
        const message5 = require('../src/message-dictionary');
        message5.init({
            dirPath: path.join('./locales'),
            namespace: 'global'
        }).drop();
        message5.init({
            dirPath: path.join('./locales'),
            namespace: 'global2'
        }).drop();
    });

})