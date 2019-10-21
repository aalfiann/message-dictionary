const assert = require('assert');
const MessageDictionary = require('../src/message-dictionary');
const path = require('path');

describe('intentional failure test', function() {

    var config = {
        dirPath: path.join('./locales')
    }

    it('promisify with catch error', function(){
        var msg = new MessageDictionary(config);
        msg.promisify().then(function(message) {

        },function(err){
            return err;
        });
    });

    it('drop with no callback', function(done){
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.drop();
        done();
    });

    it('drop with wrong path', function(done){
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.drop(function(err) {
            if(err === null) assert.deepEqual(msg.list(),[]);
        });
        msg.drop(function(err) {
            if(err === null) assert.deepEqual(msg.list(),[]);
        });
        done();
    });

    it('update data with empty datatable', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.update('123','tester', '', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to update, data is not exists!' });
            done();
        });
    });

    it('delete data with empty datatable', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.delete('123', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to delete, data is not exists!' });
            done();
        });
    });

    it('add new duplicate data', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.add('123','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        msg.add('123','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to save, data already exists!' });
            done();
        });
    });

    it('delete data with empty code', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){
            msg.delete('',function(err,data) {
                
            });
        },Error);
    });

    it('write with empty table', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.table = '';
        msg.write(function(err,data) {
            assert.deepEqual(data,{ status: false, message: 'Nothing to save!' });
            done();
        });
    });

    it('write with singular data table', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        var o = {};
        o.o = o;
        msg.table = o;
        msg.write(function(err,data) {
            assert.deepEqual(data,{ status: false, message: 'Nothing to save!' });
            done();
        });
    });

    it('read stream with wrong path', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.readStream('home/',function(err,data) {
            assert.equal(err.code,'ENOENT');
            done();
        });
    });

    it('reload with wrong path', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary({
            dirPath:'/'
        }).init();
        msg.reload(function(err) {
            assert.equal(err.code,'ENOENT');
            done();
        });
    });

    it('wrong get key', function() {
        var msg = new MessageDictionary(config).init();
        assert.deepEqual(msg.get('000'),{code:0,message:'Unknown error!'});
    });

    it('add with wrong object type in code', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.add([],'','',function() {

        })},Error);
    });

    it('add with wrong object type in message', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.add('1234',[],'',function() {

        })},Error);
    });

    it('add with wrong object type in extend', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.add('1234','abc',[],function() {

        })},Error);
    });
    
    it('update with wrong object type in code', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.update([],'','',function() {

        })},Error);
    });

    it('update with wrong object type in message', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.update('123',[],'',function() {

        })},Error);
    });

    it('update with wrong object type in extend', function() {
        var msg = new MessageDictionary(config).init();
        assert.throws(function(){msg.update('123','abc',[],function() {

        })},Error);
    });

    it('init with empty file', function() {
        var msg = new MessageDictionary({
            locale:'id',
            dirPath: path.join('./locales')
        }).init();
        assert.deepEqual(msg.table,[]);
    });

    it('write stream', function() {
        var msg = new MessageDictionary(config).init();
        msg.writeStream('home/aaa',{ flag:'wx'},'',function(err,data) {
            assert.equal(err.code,'ENOENT');
        })
    });

    it('delete with error path', function() {
        var msg = new MessageDictionary(config).init();
        msg.delete('000',function(err,data) {
            assert.deepEqual(data,{ status: false,
                message: 'Failed to delete, data is not exists!' });
        })
    });

    it('cleanup test', function() {
        var test1 = new MessageDictionary(config);
        test1.drop();
        var test2 = new MessageDictionary({
            locale:'id',
            dirPath: path.join('./locales')
        });
        test2.drop();
    });

});