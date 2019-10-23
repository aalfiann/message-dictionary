# message-dictionary
[![NPM](https://nodei.co/npm/message-dictionary.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/message-dictionary/)  
  
[![npm version](https://img.shields.io/npm/v/message-dictionary.svg?style=flat-square)](https://www.npmjs.org/package/message-dictionary)
[![Build Status](https://travis-ci.org/aalfiann/message-dictionary.svg?branch=master)](https://travis-ci.org/aalfiann/message-dictionary)
[![Coverage Status](https://coveralls.io/repos/github/aalfiann/message-dictionary/badge.svg?branch=master)](https://coveralls.io/github/aalfiann/message-dictionary?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/aalfiann/message-dictionary/badge.svg?targetFile=package.json)](https://snyk.io//test/github/aalfiann/message-dictionary?targetFile=package.json)
[![dependencies Status](https://david-dm.org/aalfiann/message-dictionary/status.svg)](https://david-dm.org/aalfiann/message-dictionary)
![License](https://img.shields.io/npm/l/message-dictionary)
![NPM download/month](https://img.shields.io/npm/dm/message-dictionary.svg)
![NPM download total](https://img.shields.io/npm/dt/message-dictionary.svg)  
A Simple Message Dictionary Manager for NodeJS (Multi Language)


### Background
When we create a Rest API, sometimes we need to standardize the default app messages (`ex. the error messages`) which is support namespace and internationalization.

## Install using NPM
```bash
$ npm install message-dictionary
```

## Usage
```javascript
const message = require('message-dictionary');

var config = {
    dirPath: require('path').join('./locales'),  // Required
    namespace: 'app'
}
message.init(config).load();
```  
**Note:**
- `dirPath` is required.
- `init()` is to set the configuration.
- `load()` is to load locales file data into memory.
- This library is working like singleton, so you don't need to always load and re-init.


### Get List
```javascript
console.log(message.list());

// Output
// []
```
The result output above is `[]` because you have no any exists data messages.  
So let's us create one data. See below.  

### Add Message
```javascript
message.addMessage('EX001','en','Just example data!','',function(err,data) {
    if(data.status == true) {
        console.log(msg.list());

        // output
        // [ { code:'EX001', message: { en: 'Just example data!' } } ]
    }
});

// or with more information
message.addMessage('EX001','Just example data!',{user:'john'},function(err,data) {
   if(data.status == true) {
        console.log(message.list());

        // output
        // [ { code:'EX001', message: { en: 'Just example data!' }, user: 'john' } ]
    }
});
```

### Update Message
```javascript
message.updateMessage('EX001','Just update data!','',function(err,data) {
    if(data.status == true) {
        console.log(message.list());

        // output
        // [ { code:'EX001', message: { en: 'Just update data!' } } ]
    } 
});

// or with more information
message.updateMessage('EX001','Just update data!',{user:'doe'},function(err,data) {
    if(data.status == true) {
        console.log(message.list());

        // output
        // [ { code:'EX001', message: { en: 'Just update data!' }, user:'doe' } ]
    }
});
```

### Get Message
```javascript
console.log(message.get('EX001', 'en'));

// output
// { code:'EX001', message: { en: 'Just update data!' }, user:'doe' }
```

### Delete Message Locale
```javascript
message.deleteMessageLocale('EX001', 'en',function(err,data) {
    if(data && data.status == true) {
        console.log(message.list());

        // output
        // if you have only one records and only one locale, then it will return 
        // [ { code:'EX001', message: {}, user: 'doe' } ]
    } 
});
```

### Delete Message
```javascript
message.deleteMessage('EX001',function(err,data) {
    if(data && data.status == true) {
        console.log(message.list());

        // output
        // if you have only one records, then it will return []
    } 
});
```

## Documentation
For more features, updates and examples, Please see [here](https://github.com/aalfiann/message-dictionary/wiki).

## Unit Test
If you want to play around with test
```bash
$ npm test
```