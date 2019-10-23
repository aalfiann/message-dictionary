const assert = require('assert');
const message = require('../src/message-dictionary');
const path = require('path');

describe('intentional failure test', function() {

    var config = {
        dirPath: path.join('./locales')
    }

    it('drop with no callback', function(done){
        this.timeout(10000);
        message.init(config);
        message.drop();
        done();
    });

    it('drop with wrong path', function(done){
        this.timeout(10000);
        message.drop(function(err) {
            if(err === null) assert.deepEqual(message.list(),[]);
        });
        message.drop(function(err) {
            if(err === null) assert.deepEqual(message.list(),[]);
        });
        done();
    });

    it('update data with empty datatable', function(done) {
        this.timeout(10000);
        message.updateMessage('123','en','tester', '', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to update, data is not exists!' });
            done();
        });
    });

    it('delete data with empty datatable', function(done) {
        this.timeout(10000);
        message.deleteMessageLocale('123','en', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to delete, data is not exists!' });
            done();
        });
    });

    it('add new duplicate data', function(done) {
        this.timeout(10000);
        message.addMessage('123','en','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        message.addMessage('123','en','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: true, message: 'Data successfully updated!' });
            done();
        });
    });

    it('delete data with empty code', function() {
        assert.throws(function(){
            message.deleteMessage('',function(err,data) {
                
            });
        },Error);
    });

    it('write with empty table', function(done) {
        this.timeout(10000);
        message._setTable('');
        message._write(function(err,data) {
            assert.deepEqual(data,{ status: false, message: 'Nothing to save!' });
            done();
        });
    });

    it('write with singular data table', function(done) {
        this.timeout(10000);
        var o = {};
        o.o = o;
        message._setTable(o);
        message._write(function(err,data) {
            assert.deepEqual(data,{ status: false, message: 'Nothing to save!' });
            done();
        });
    });

    it('read stream with wrong path', function(done) {
        this.timeout(10000);
        message._readStream('/',function(err,data) {
            assert.notEqual(err,null);
            done();
        });
    });

    it('reload with wrong path', function(done) {
        this.timeout(10000);
        message.init({dirPath:'/'});
        message.reload(function(err) {
            assert.equal(err.code,'ENOENT');
            done();
        });
    });

    it('reload with wrong path with no callback', function() {
        message.init({dirPath:'/'});
        message.reload();
    });

    it('wrong get key', function(done) {
        message.init(config);
        message.reload(function(err,data) {
            assert.deepEqual(message.get('000','en'),{code:0,message:'Unknown error!'});
            done();
        })
    });

    it('add with wrong object type in code', function() {
        assert.throws(function(){message.addMessage([],'','','',function() {

        })},Error);
    });

    it('add with wrong object type in message', function() {
        assert.throws(function(){message.addMessage('1234','en',[],'',function() {

        })},Error);
    });

    it('add with empty locale', function() {
        assert.throws(function(){message.addMessage('1234','',[],'',function() {

        })},Error);
    });

    it('add with wrong object type in extend', function() {
        assert.throws(function(){message.addMessage('1234','en','abc',[],function() {

        })},Error);
    });
    
    it('update with wrong object type in code', function() {
        assert.throws(function(){message.updateMessage([],'','','',function() {

        })},Error);
    });

    it('update with wrong object type in message', function() {
        assert.throws(function(){message.updateMessage('123','en',[],'',function() {

        })},Error);
    });

    it('update with empty locale', function() {
        assert.throws(function(){message.updateMessage('123','',[],'',function() {

        })},Error);
    });

    it('update with wrong object type in extend', function() {
        assert.throws(function(){message.updateMessage('123','en','abc',[],function() {

        })},Error);
    });

    it('delete message by locale with empty code', function() {
        assert.throws(function(){message.deleteMessageLocale('','en','abc',[],function() {

        })},Error);
    });

    it('delete message by locale with empty locale', function() {
        assert.throws(function(){message.deleteMessageLocale('123','','abc',[],function() {

        })},Error);
    });

    it('write stream', function() {
        message._writeStream('/',{ flag:'wx'},'',function(err,data) {
            assert.notEqual(err,null);
        })
    });

    it('delete with error path', function() {
        message.deleteMessage('000',function(err,data) {
            assert.deepEqual(data,{ status: false,
                message: 'Failed to delete, data is not exists!' });
        })
    });

    it('get data by locale with empty code', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'app'
        }).load();        
        assert.deepEqual(message.get('','id'),{ code: '0', message: 'Unknown error!' });
    });
    
    it('get data by locale which is not exists', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'app'
        }).load();        
        assert.deepEqual(message.get('234','id'),{ code: '234', message: 'Unknown error!' });
    });

    it('getAll with empty code', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'app'
        }).load();
        assert.deepEqual(message.getAll(''),{ code: '0', message: 'Unknown error!' });
    });

    it('getAll which is not exists', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'app'
        }).load();
        assert.deepEqual(message.getAll('123'),{ code: '0', message: 'Unknown error!' });
    });

    it('load with empty file', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'test'
        });
        message._writeStream(path.join('./locales/test.js'),{flag:'w'},'', function (err,content) {
            message.load();
            assert.deepEqual(message.list(),[]);
        });
    });

    it('cleanup app and failure test', function() {
        message.init({
            dirPath: path.join('./locales'),
            namespace:'app'
        }).drop();
        message.init({
            dirPath: path.join('./locales'),
            namespace:'test'
        }).drop(function(err) {
            if(err) return console.log(err);
        });
    });

});