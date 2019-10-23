const FlyJson = require('fly-json-odm');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const nosql = new FlyJson();

var table = [];
var namespace = 'app';
var dirPath = '';

module.exports = {
    _isCallable,
    _write,
    _writeStream,
    _readStream,
    _setTable,
    init,
    load,
    reload,
    addMessage,
    updateMessage,
    deleteMessage,
    deleteMessageLocale,
    drop,
    list,
    get,
    getAll,
    getDirPath,
    getNamespace,
    getFilename
}

/**
 * Init configuration
 * @param {*} config 
 */
function init(config) {
    var self = this;
    if(!nosql.isEmpty(config) && nosql.isObject(config)) {
        for(var key in config) {
            if(config.hasOwnProperty(key)) {
                [key] = config[key];
            }
        }
    } else {
        throw new Error('Config must be an object type!');
    }
    if(config.dirPath) dirPath = config.dirPath;
    if(config.namespace) namespace = config.namespace;
    if(nosql.isEmpty(config.dirPath)) throw new Error('dirPath is required!');
    return self;
}

/**
 * Check the parameter is callback
 * @param {function} fn 
 * @return {bool}
 */
function _isCallable(fn) {
    return typeof fn === "function";
}

/**
 * Get Filename
 * @return {string}
 */
function getFilename() {
    return path.join(dirPath + '/' + namespace + '.js');
}

/**
 * Write to file
 * @param {fn} callback      [optional] Callback(error, data)
 */
function _write(callback) {
    var self = this;
    if(!nosql.isEmpty(table) && nosql.isArray(table)) {
        var file = self.getFilename();
        mkdirp(path.dirname(file), function (err) {
            if (err) return callback(err);
            self._writeStream(file,{flag:'w+'},JSON.stringify(table),function(err,data) {
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
function _writeStream(file,opt,data,callback) {
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
function _readStream(file, callback) {
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
function load() {
    var self = this;
    var file = self.getFilename();
    try{
        var data = fs.readFileSync(file, "utf8");   
        if(!nosql.isEmpty(data)) {
            table = nosql.deepClone(JSON.parse(data));
        } else {
            table = [];
        }
    } catch (err) {
        table = [];
    }
    return self;
}

/**
 * Reload data from file to table (Asynchronous)
 * @param {fn} callback      Callback(error, data)
 * @return {callback}
 */
function reload(callback) {
    var self = this;
    var file = self.getFilename();
    self._readStream(file, (err, data) => {
        if(err) {
            if(self._isCallable(callback)) return callback(err);
        } else {    
            table = nosql.deepClone(JSON.parse(data));
            if(self._isCallable(callback)) {
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
 * @param {string} locale       Two letters of code language
 * @param {string} message      Value of message
 * @param {object} extend       [optional] Add more data into message
 * @param {fn} callback          Callback(error, data)
 */
function addMessage(code,locale,message,extend,callback) {
    if(nosql.isEmpty(code) || !nosql.isString(code)) {
        throw new Error('Code is required and must be string!');
    }
    
    if(nosql.isEmpty(locale) || !nosql.isString(locale)) {
        throw new Error('Locale is required and must be string!');
    }

    if(nosql.isEmpty(message) || !nosql.isString(message)) {
        throw new Error('Message is required and must be string!');
    }

    if(!nosql.isEmpty(extend) && !nosql.isObject(extend)) {
        throw new Error('Extend must be an object type!');
    }

    var self = this;
    var obj = {
        code:code,
        message:{}
    };
    
    if(!nosql.isEmpty(extend) && !nosql.isEmptyObject(extend)) Object.assign(obj,extend);
    nosql.promisify((builder) => {return builder}).then((datatable) => {
        var find = datatable.set(table).where('code',code).exec();
        if(find.length == 0) {
            Object.assign(obj.message,{[locale]:message});
            table = datatable.set(table).insert(obj).exec();
            self._write(function(err,result) {
                if(err) return callback(err);
                callback(null,result);
            });
        } else {
            self.updateMessage(code,locale,message,extend,function(err,data) {
                if(err) return callback(err);
                callback(null,data);
            });
        }
    });
}

/**
 * Update message
 * @param {string} code         ID of message
 * @param {string} locale       Two letters of code language
 * @param {string} message      Value of message
 * @param {object} extend       [optional] Add more data into message
 * @param {fn} callback          Callback(error, data)
 */
function updateMessage(code,locale,message,extend,callback) {
    if(nosql.isEmpty(code) || !nosql.isString(code)) {
        throw new Error('Code is required and must be string!');
    }

    if(nosql.isEmpty(locale) || !nosql.isString(locale)) {
        throw new Error('Locale is required and must be string!');
    }
        
    if(nosql.isEmpty(message) || !nosql.isString(message)) {
        throw new Error('Message is required and must be string!');
    }

    if(!nosql.isEmpty(extend) && !nosql.isObject(extend)) {
        throw new Error('Extend must be an object type!');
    }

    var self = this;
    nosql.promisify((builder) => {return builder}).then((datatable) => {
        var find = datatable.set(table).where('code',code).exec();
        if(find.length > 0) {
            Object.assign(find[0].message,{[locale]:message})
            if(!nosql.isEmpty(extend) && !nosql.isEmptyObject(extend)) Object.assign(find[0],extend);
            table = datatable.set(table).modify('code',code,find[0]).exec();
            self._write(function(err) {
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
 * Delete message locale (only delete the specified locale message)
 * @param {string} code         ID of message
 * @param {string} locale       Two letters of code language
 * @param {fn} callback         Callback(error, data)
 */
function deleteMessageLocale(code,locale,callback) {
    if(nosql.isEmpty(code) || !nosql.isString(code)) {
        throw new Error('Code is required and must be string!');
    }

    if(nosql.isEmpty(locale) || !nosql.isString(locale)) {
        throw new Error('Locale is required and must be string!');
    }

    var self = this;
    nosql.promisify((builder) => {return builder}).then((datatable) => {
        var find = datatable.set(table).where('code',code).exec();
        if(find.length > 0) {
            if(find[0].message[locale] !== undefined) {
                delete find[0].message[locale];
            }
            table = datatable.set(table).modify('code',code,find[0]).exec();
            self._write(function(err) {
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
 * Delete Message
 * @param {string} code     ID of message
 * @param {fn} callback     Callback(error, data) 
 */
function deleteMessage(code,callback) {
    if(nosql.isEmpty(code) || !nosql.isString(code)) {
        throw new Error('Code is required and must be string!');
    }

    var self = this;
    nosql.promisify((builder) => {return builder}).then((datatable) => {
        var find = datatable.set(table).where('code',code).exec();
        if(find.length > 0) {
            table = datatable.set(table).delete('code',code).exec();
            self._write(function(err) {
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
 * @param {fn} callback     [optional] Callback(error)
 */
function drop(callback) {
    var self = this;
    table = [];
    fs.unlink(self.getFilename(), function (err) {
        if(self._isCallable(callback)) {
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
function list() {
    return table;
}

/**
 * Get message by code id
 * @param {string} code     ID of message
 * @return {object} 
 */
function getAll(code) {
    var datatable = nosql.set(table).where('code',code).exec();
    if(datatable.length > 0) {
        return datatable[0];
    }
    return {code:'0',message:'Unknown error!'}
}

/**
 * Get message by code id
 * @param {string} code     ID of message
 * @param {string} locale   Two letters of code language
 * @return {object} 
 */
function get(code,locale) {
    if(!nosql.isEmpty(code) && !nosql.isEmpty(locale)) {
        var datatable = nosql.set(table).where('code',code).exec();
        if(datatable.length > 0) {
            var obj = datatable[0];
            if(obj.message[locale] !== undefined) {
                var newmsg = obj.message[locale];
                delete obj.message;
                Object.assign(obj,{message:newmsg});
                return obj;
            }
            return {code:code,message:'Unknown error!'}
        }
    }
    return {code:'0',message:'Unknown error!'}
}

/**
 * Get current directory setting
 */
function getDirPath() {
    return dirPath;
}

/**
 * Get current namespace setting
 */
function getNamespace() {
    return namespace;
}

/**
 * Set table directly (for development use)
 * @param {array} data      Array with object 
 */
function _setTable(data) {
    var self = this;
    table = data;
    return self;
}