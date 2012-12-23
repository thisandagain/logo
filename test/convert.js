/**
 * Unit test suite.
 *
 * @package logo
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var fs      = require('fs'),
    async   = require('async'),
    test    = require('tap').test,
    logo    = require('../lib/index.js');

async.auto({
    basic:      function (callback) {
        logo.convert('repeat 4 [fd 50 rt 90]', callback);
    },

    complex:    function (callback) {
        logo.convert('repeat 50 [repeat 100 [fd 300 bk 295 rt 2] rt 180]', callback);
    },

    error:      function (callback) {
        logo.convert('forever [fd 50 rt 90]', function (err, obj) {
            callback(obj, err); // Reverse
        });
    },

    test:   ['basic', 'complex', 'error', function (callback, obj) {
        console.dir(obj.basic);

        test('Component definition', function (t) {
            t.type(logo, 'object', 'Component should be an object');
            t.type(logo.convert, 'function', 'Method should be a function');
            t.type(logo.stream, 'object', 'Method should be an object');
            t.end();
        });

        test('Basic', function (t) {
            t.type(obj.basic, 'object', 'Results should be an object');
            t.equal(obj.basic.length, 10, 'Results should be proper length');
            t.ok(typeof obj.basic[0].begin === 'object', 'First item should be the begin command');             // GH-1
            t.ok(typeof obj.basic[9].begin !== 'object', 'First item should not include the begin command');    // GH-1
            t.ok(typeof obj.basic[9].end === 'object', 'First item should be the end command');                 // GH-1
            t.end();
        });

        test('Complex', function (t) {
            t.type(obj.complex, 'object', 'Results should be an object');
            t.equal(obj.complex.length, 15052, 'Results should be proper length');
            t.end();
        });

        test('Error', function (t) {
            t.type(obj.error, 'string', 'Results should be a string');
            t.end();
        });

        callback();
    }]
}, function (err, obj) {
    test('Catch errors', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.end();
    });
});