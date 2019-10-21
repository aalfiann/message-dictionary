'use strict';

const FlyJson = require('fly-json-odm');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class MessageDictionary {

    /**
     * Constructor
     * @param {object} config
     * 
     * Default is
     * {
     *   "locale": "en",
     *   "dirPath": "./locales",
     *   "namespace": "app"
     * } 
     */
    constructor(config={}) {
        this.table = [];
        this.nosql = new FlyJson();
        if(!this.nosql.isEmpty(config) && this.nosql.isObject(config)) {
            for(var key in config) {
                if(config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        } else {
            throw new Error('Config must be an object type!');
        }
        if(!config.locale) this.locale = "en";
        if(!config.dirPath) this.dirPath = "./locales";
        if(!config.namespace) this.namespace = "app";
    }

    /**
     * Check the parameter is callback
     * @param {function} fn 
     * @return {bool}
     */
    isCallable(fn) {
        return typeof fn === "function";
    }

    /**
     * Get Filename
     * @return {string}
     */
    getFilename() {
        return path.join(__dirname,this.dirPath + '/' + this.namespace + '/' + this.locale + '.js');
    }

    /**
     * Write to file
     * @param {fn} callback      [optional] Callback(error, data)
     */
    write(callback) {
        var self = this;
        if(!this.nosql.isEmpty(this.table) && this.nosql.isArray(this.table)) {
            var file = this.getFilename();
            mkdirp(path.dirname(file), function (err) {
                if (err) return callback(err);
                self.writeStream(file,{flag:'w+'},JSON.stringify(self.table),function(err,data) {
                    if(err) return callback(err);
                    callback(null,data);
                });
            });
        } else {
            callback(null, {
                status:false,
                message:'Nothing to save!',
            });
        }
    }

    /**
     * Write Stream
     * @param {string} file             File path to be write
     * @param {string|object} opt       Default is { flag="w" } 
     * @param {string} data             Content to write
     * @param {fn} callback              Callback(error, content)
     * @return {callback} 
     */
    writeStream(file,opt,data,callback) {
        let writeStream = fs.createWriteStream(file,opt);

        // write some data string with a utf8 encoding
        writeStream.write(data, 'utf8');

        writeStream.on('error', function(err) {
            writeStream.end();
            return callback(err);
        });

        // the finish event is emitted when all data has been flushed from the stream
        writeStream.on('finish', () => {
            // close the stream
            writeStream.end();
            return callback(null,{
                status:true,
                message:'Data successfully saved!'
            });
        });

        // close the stream
        writeStream.end();
    }

    /**
     * Read Stream
     * @param {string} file     File path to be read
     * @param {fn} callback      Callback(error, data)
     * @return {callback}
     */
    readStream(file, callback) {
        const chunks = [];
        let stream = fs.createReadStream(file,{flag:'w+'});
        stream.on('error', (err) => {
            callback(err);
        });
        
        stream.on('data', (chunk) => {
            chunks.push(null, chunk.toString());
        });

        stream.on('end', () => {
            callback(null, chunks.join(''));
        });
    }

    /**
     * Load data from file into table (Synchronous)
     * @return {this}
     */
    init() {
        var file = this.getFilename();
        try{
            var data = fs.readFileSync(file, "utf8");   
            if(!this.nosql.isEmpty(data)) {
                this.table = this.nosql.deepClone(JSON.parse(data));
            }
        } catch (err) {

        }
        return this;
    }

    /**
     * Reload data from file to table (Asynchronous)
     * @param {fn} callback      Callback(error, data)
     * @return {callback}
     */
    reload(callback) {
        var self = this;
        var file = self.getFilename();
        self.readStream(file, (err, data) => {
            if(err) {
                if(self.isCallable(callback)) return callback(err);
            } else {    
                self.table = self.nosql.deepClone(JSON.parse(data));
                if(self.isCallable(callback)) {
                    callback(null, {
                        status: true,
                        message: 'Successfully to reload datatable!'
                    });
                }
            }
        });
    }

    /**
     * Add message
     * @param {string} code         ID of message
     * @param {string} message      Value of message
     * @param {object} extend       [optional] Add more data into message
     * @param {fn} callback          Callback(error, data)
     */
    add(code,message,extend,callback) {
        if(this.nosql.isEmpty(code) || !this.nosql.isString(code)) {
            throw new Error('Code is required and must be string!');
        }
        
        if(this.nosql.isEmpty(message) || !this.nosql.isString(message)) {
            throw new Error('Message is required and must be string!');
        }

        if(!this.nosql.isEmpty(extend) && !this.nosql.isObject(extend)) {
            throw new Error('Extend must be an object type!');
        }

        var self = this;
        var obj = {
            code:code,
            message:message
        };

        if(!this.nosql.isEmpty(extend) && !this.nosql.isEmptyObject(extend)) Object.assign(obj,extend);
        this.nosql.promisify((builder) => {return builder}).then((datatable) => {
            var find = datatable.set(self.table).where('code',code).exec();
            if(find.length == 0) {
                self.table = datatable.set(self.table).insert(obj).exec();
                self.write(function(err,result) {
                    if(err) return callback(err);
                    callback(null,result);
                });
            } else {
                callback(null, {
                    status:false,
                    message:'Failed to save, data already exists!',
                });
            }
        });
    }

    /**
     * Update message
     * @param {string} code         ID of message
     * @param {string} message      Value of message
     * @param {object} extend       [optional] Add more data into message
     * @param {fn} callback          Callback(error, data)
     */
    update(code,message,extend,callback) {
        if(this.nosql.isEmpty(code) || !this.nosql.isString(code)) {
            throw new Error('Code is required and must be string!');
        }
        
        if(this.nosql.isEmpty(message) || !this.nosql.isString(message)) {
            throw new Error('Message is required and must be string!');
        }

        if(!this.nosql.isEmpty(extend) && !this.nosql.isObject(extend)) {
            throw new Error('Extend must be an object type!');
        }

        var self = this;
        var obj = {
            code:code,
            message:message
        };

        if(!this.nosql.isEmpty(extend) && !this.nosql.isEmptyObject(extend)) Object.assign(obj,extend);
        this.nosql.promisify((builder) => {return builder}).then((datatable) => {
            var find = datatable.set(self.table).where('code',code).exec();
            if(find.length > 0) {
                self.table = datatable.set(self.table).modify('code',code,obj).exec();
                self.write(function(err) {
                    if(err) return callback(err);
                    callback(null, {
                        status:true,
                        message:'Data successfully updated!'
                    });
                });
            } else {
                callback(null, {
                    status:false,
                    message:'Failed to update, data is not exists!',
                });
            }
        });
    }

    /**
     * Delete message
     * @param {string} code     ID of message
     * @param {fn} callback     Callback(error, data)
     */
    delete(code,callback) {
        if(this.nosql.isEmpty(code) || !this.nosql.isString(code)) {
            throw new Error('Code is required and must be string!');
        }

        var self = this;
        this.nosql.promisify((builder) => {return builder}).then((datatable) => {
            var find = datatable.set(self.table).where('code',code).exec();
            if(find.length > 0) {
                self.table = datatable.set(self.table).delete('code',code).exec();
                self.write(function(err) {
                    if(err) return callback(err);
                    callback(null, {
                        status:true,
                        message:'Data successfully deleted!'
                    });
                });
            } else {
                callback(null, {
                    status:false,
                    message:'Failed to delete, data is not exists!',
                });
            }
        });
    }

    /**
     * Delete all message
     * @param {fn} callback     [optional] Callback(err)
     */
    drop(callback) {
        var self = this;
        self.table = [];
        fs.unlink(this.getFilename(), function (err) {
            if(self.isCallable(callback)) {
                if(err) {
                    return callback(err);
                }
            }
        });
    }

    /**
     * Get list message in data table
     * @return {object}
     */
    list() {
        return this.table;
    }

    /**
     * Get message by code id
     * @param {string} code     ID of message
     * @return {object} 
     */
    get(code) {
        var datatable = this.nosql.set(this.table).where('code',code).exec();
        if(datatable.length > 0) {
            return datatable[0];
        }
        return {code:0,message:'Unknown error!'}
    }

    /**
     * Make asynchronous process with Promise
     * @param {function} fn
     * @return {this} 
     */
    promisify(fn) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try{
                resolve(fn.call(self,self));
            } catch (err) {
                reject(err);
            }
        });
    }

}

module.exports = MessageDictionary;