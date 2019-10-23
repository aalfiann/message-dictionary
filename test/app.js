const assert = require('assert');
const message = require('../src/message-dictionary');
const path = require('path');

describe('message-dictionary test', function() {

    var config = {
        dirPath: path.join('./locales')
    }
    
    it('filename check', function() {
        message.init(config);
        var file = message.getFilename();
        assert.equal(file.endsWith('locales/app.js'),true);
    });

    it('drop datatable', function(done) {
        this.timeout(10000);
        message.drop(function(err) {
            if(err === null) assert.deepEqual(message.list(),[]);
        });
        done();
    });

    it('get list', function() {
        assert.deepEqual(message.list(),[]);
    });

    it('add new data', function(done) {
        this.timeout(10000);
        message.addMessage('123','en','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function(){
            assert.deepEqual(message.list(),[ { code: '123', message: { en:'Insert data successfully!' } } ]);
            done();
        },1000);
    });

    it('reload list', function(done) {
        this.timeout(10000);
        message.addMessage('234','en','Insert data successfully!',{user:'doe'},function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function(){
            assert.deepEqual(message.list(),[ 
                    { code: '123', message: { en: 'Insert data successfully!' } },
                    { code: '234',
                      message: { en: 'Insert data successfully!' },
                      user: 'doe' } 
                ]);
            done();
        },1000);
    });

    it('update data', function(done) {
        this.timeout(10000);
        message.updateMessage('123','en','Update data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(message.getAll('123'),{ code: '123', message: { en: 'Update data successfully!' } });
            done();
        },1000);
    });

    it('update data with extend information', function(done) {
        this.timeout(10000);
        message.updateMessage('123','en','Update data successfully!',{user:'john'},function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(message.getAll('123'),{ code: '123', message: { en: 'Update data successfully!' }, user:'john' });
            done();
        },1000);
    });

    it('get data', function() {
        assert.deepEqual(message.get('123','en'),{ code: '123',
            user: 'john',
            message: 'Update data successfully!' 
        });
    });

    it('delete data by locale', function(done) {
        this.timeout(10000);
        message.deleteMessageLocale('123','en', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(message.list(),[ 
                { code: '234', message: { en: 'Insert data successfully!' }, user: 'doe' },
                { code: '123', message: {}, user: 'john' } 
            ]);
            done();
        },1000);
    });

    it('delete data by locale which is not exists', function(done) {
        this.timeout(10000);
        message.deleteMessageLocale('123','id', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(message.list(),[ 
                { code: '234', message: { en: 'Insert data successfully!' }, user: 'doe' },
                { code: '123', message: {}, user: 'john' } 
            ]);
            done();
        },1000);
    });

    it('delete data', function(done) {
        this.timeout(10000);
        message.deleteMessage('123', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(message.list(),[ 
                { code: '234', message: { en: 'Insert data successfully!' }, user: 'doe' } 
            ]);
            done();
        },1000);
    });

});