## Logo
#### A streaming parser for the [LOGO](http://en.wikipedia.org/wiki/Logo_(programming_language)) programming language.

[![Build Status](https://secure.travis-ci.org/thisandagain/logo.png?branch=master)](http://travis-ci.org/thisandagain/logo)

### Installation
```bash
npm install logo
```

### Basic Use
```javascript
var fs      = require('fs'),
    logo    = require('logo');

fs.createReadStream('aWholeCatLoadofLogo.txt').pipe(logo.stream).pipe(process.stdout);
```

### Single command use
```javascript
var logo    = require('logo');

logo.convert('REPEAT 4 [FD 200 RT 90]', function (err, obj) {
    console.dir(obj);   // Woo! Programming party! 
});
```

### To Test
```bash
npm test
```