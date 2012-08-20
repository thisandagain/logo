/**
 * Dependencies
 */
var async   = require('async'),
    test    = require('tap').test,
    fs      = require('fs'),
    logo    = require('../lib/index');

var buffer  = '',
    stream  = logo.stream;

async.auto({
    stream:     function (callback) {
        fs.createReadStream(__dirname + '/instructions.txt').pipe(logo.stream);

        stream.on('data', function (data) {
            buffer += JSON.stringify(data);
        });

        stream.on('end', function () {
            callback();
        });
    },

    test:       ['stream', function (callback, obj) {
        test("Component definition", function (t) {
            t.type(logo, "object", "Component should be an object");
            t.type(logo.convert, "function", "Method should be a function");
            t.type(logo.stream, "object", "Method should be an object");
            t.end();
        });

        test("Stream", function (t) {
            t.type(buffer, "string", "Results should be a string");
            t.ok(buffer.length > 53000, "Results should be proper length");
            t.end();
        });

        callback();
    }]
}, function (err, obj) {
    test("Catch errors", function (t) {
        t.equal(err, null, "Errors should be null");
        t.end();
        process.exit();
    });
});