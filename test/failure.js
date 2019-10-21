const assert = require('assert');
const MessageDictionary = require('../src/message-dictionary');

describe('intentional failure test', function() {

    it('promisify with catch error', function(){
        var msg = new MessageDictionary();
        msg.promisify().then(function(message) {

        },function(err){
            return err;
        });
    });

    it('drop with no callback', function(done){
        this.timeout(10000);
        var msg = new MessageDictionary().init();
        msg.drop();
        done();
    });

    it('drop with wrong path', function(done){
        this.timeout(10000);
        var msg = new MessageDictionary().init();
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
        var msg = new MessageDictionary().init();
        msg.update('123','tester', '', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to update, data is not exists!' });
            done();
        });
    });

    it('delete data with empty datatable', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary().init();
        msg.delete('123', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            assert.deepEqual(data, { status: false,
                message: 'Failed to delete, data is not exists!' });
            done();
        });
    });

    it('add new duplicate data', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary().init();
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
        var msg = new MessageDictionary().init();
        assert.throws(function(){
            msg.delete('',function(err,data) {
                
            });
        },Error);
    });

    it('write with empty table', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary().init();
        msg.table = '';
        msg.write(function(err,data) {
            assert.deepEqual(data,{ status: false, message: 'Nothing to save!' });
            done();
        });
    });

    it('write with singular data table', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary().init();
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
        var msg = new MessageDictionary().init();
        msg.readStream('/',function(err,data) {
            assert.notEqual(err,null);
            done();
        });
    });

    it('reload with wrong path', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary({
            dirPath:'/'
        }).init();
        msg.reload(function(err) {
            assert.notEqual(err,null);
            done();
        });
    });

    it('wrong get key', function() {
        var msg = new MessageDictionary().init();
        assert.deepEqual(msg.get('000'),{code:0,message:'Unknown error!'});
    });

    it('add with wrong object type in code', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.add([],'','',function() {

        })},Error);
    });

    it('add with wrong object type in message', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.add('1234',[],'',function() {

        })},Error);
    });

    it('add with wrong object type in extend', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.add('1234','abc',[],function() {

        })},Error);
    });
    
    it('update with wrong object type in code', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.update([],'','',function() {

        })},Error);
    });

    it('update with wrong object type in message', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.update('123',[],'',function() {

        })},Error);
    });

    it('update with wrong object type in extend', function() {
        var msg = new MessageDictionary().init();
        assert.throws(function(){msg.update('123','abc',[],function() {

        })},Error);
    });

    it('init with empty file', function() {
        var msg = new MessageDictionary({
            locale:'id'
        }).init();
        assert.deepEqual(msg.table,[]);
    });

    it('write stream', function() {
        var msg = new MessageDictionary().init();
        msg.writeStream('',{ flag:'wx'},'',function(err,data) {
            assert.notEqual(err,null);
        })
    });

    it('read stream', function() {
        var msg = new MessageDictionary().init();
        msg.readStream('/',function(err,data) {
            assert.notEqual(err,null);
        })
    });

    it('delete with error path', function() {
        var msg = new MessageDictionary().init();
        msg.delete('000',function(err,data) {
            assert.deepEqual(data,{ status: false,
                message: 'Failed to delete, data is not exists!' });
        })
    });

    it('cleanup test', function() {
        var test1 = new MessageDictionary();
        test1.drop();
        var test2 = new MessageDictionary({
            locale:'id'
        });
        test2.drop();
    });

    it('reload with no file path', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary().init();
        msg.reload(function(err) {
            assert.notEqual(err,null);
            done();
        });
    });

});