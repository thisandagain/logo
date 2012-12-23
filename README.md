## Logo
#### A streaming parser for the [LOGO](http://en.wikipedia.org/wiki/Logo_(programming_language\)) programming language.

[![Build Status](https://secure.travis-ci.org/thisandagain/logo.png?branch=master)](http://travis-ci.org/thisandagain/logo)

The `logo` module converts [LOGO](http://en.wikipedia.org/wiki/Logo_(programming_language\)) statements into an easily applied command stream. As per convention, the parser can be used either in a standard callback pattern or as a readable/writable stream.

### Installation
```bash
npm install logo
```

### Basic Use
```javascript
var logo    = require('logo');

logo.convert('REPEAT 4 [FD 200 RT 90]', function (err, obj) {
    console.dir(obj);   // Woo! Programming party! 
});
```

### Stream
```javascript
var fs      = require('fs'),
    logo    = require('logo');

fs.createReadStream('aWholeCatLoadOfLogo.txt').pipe(logo.stream).pipe(process.stdout);
```

### Examples
[logo-drone](https://github.com/maxogden/logo-drone) - Control a parrot AR drone using the LOGO programming language

[turtle](https://github.com/thisandagain/turtle) - Multi-user visual programming environment

### 

### To Test
```bash
npm test
```