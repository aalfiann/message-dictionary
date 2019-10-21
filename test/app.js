const assert = require('assert');
const MessageDictionary = require('../src/message-dictionary');
const path = require('path');
describe('message-dictionary test', function() {

    var config = {
        dirPath: path.join('./locales')
    }
    
    it('filename check', function() {
        var msg = new MessageDictionary(config);
        var file = msg.getFilename();
        assert.equal(file.endsWith('locales/app/en.js'),true);
    });

    it('drop datatable', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.drop(function(err) {
            if(err === null) assert.deepEqual(msg.list(),[]);
        });
        done();
    });

    it('get list', function() {
        var msg = new MessageDictionary(config).init();
        assert.deepEqual(msg.list(),[]);
    })

    it('add new data', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.add('123','Insert data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function(){
            assert.deepEqual(msg.list(),[ { code: '123', message: 'Insert data successfully!' } ]);
            done();
        },1000);
    });

    it('reload list', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.add('234','Insert data successfully!',{user:'doe'},function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
            msg.reload(function(err,newdata) {
                if(err) return console.log('ERROR: '+JSON.stringify(err));
                msg.reload();
            })
        });
        setTimeout(function(){
            assert.deepEqual(msg.list(),[ 
                { code: '123', message: 'Insert data successfully!' },
                { code: '234', message: 'Insert data successfully!',user:'doe' } 
            ]);
            done();
        },1000);
    });

    it('get message asynchronous', function(done) {
        var msg = new MessageDictionary(config);
        var result = undefined;
        var expected = { code: '123', message: 'Insert data successfully!' };
        msg.promisify(builder => {return builder}).then(message => {
            result = message.init().get('123');
            assert.deepEqual(result,expected);
            done();
        });
    });

    it('update data', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.update('123','Update data successfully!','',function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(msg.get('123'),{ code: '123', message: 'Update data successfully!' });
            done();
        },1000);
    });

    it('update data with extend information', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.update('123','Update data successfully!',{user:'john'},function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(msg.get('123'),{ code: '123', message: 'Update data successfully!', user:'john' });
            done();
        },1000);
    });

    it('delete data', function(done) {
        this.timeout(10000);
        var msg = new MessageDictionary(config).init();
        msg.delete('123', function(err,data) {
            if(err) return console.log('ERROR: '+JSON.stringify(err));
        });
        setTimeout(function() {
            assert.deepEqual(msg.list(),[ { code: '234', message: 'Insert data successfully!', user: 'doe' } ]);
            done();
        },1000);
    });

});