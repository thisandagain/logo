/**
 * A streaming parser for the LOGO programming language.
 *
 * @package Logo
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async       = require('async'),
    buffer      = require('bufferstream'),
    pool        = require('fork-pool');

/**
 * Module
 */
module.exports = function () {

    var Pool = new pool(__dirname + '/worker.js', null, null, {});

    /**
     * Converts a single command line to turtle compatible JSON object using a child process queue.
     *
     * @param {String} Input command
     *
     * @return {Object}
     */
    var convert = function (input, callback) {
        Pool.enqueue(input, function (err, obj) {
            if (err) {
                callback(err);
            } else {
                if (obj.stdout.err) {
                    callback(obj.stdout.err);
                } else {
                    callback(null, obj.stdout.cmd);
                }
            }
        });
    };

    /**
     * Accepts a LOGO input stream from file or HTTP and converts it to turtle compatible JSON stream.
     *
     * @param {Stream} Input stream
     *
     * @return {Stream} Output stream
     */
    var stream = new buffer({encoding:'utf8', size:'flexible'});
    stream.split('\n', function (line) {
        convert(line.toString(), function (err, obj) {
            if (err) {
                stream.emit('data', JSON.stringify([{error: err}]));
            } else {
                if (obj !== null) {
                    stream.emit('data', JSON.stringify(obj));
                }
            }
        });
    });

    // -----------------------
    // -----------------------

    return {
        convert:    convert,
        stream:     stream
    }

}();