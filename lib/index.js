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
    buffer      = require('bufferstream');

var Bridge      = require('./bridge'),
    Language    = require('./language');

/**
 * Module
 */
module.exports = function () {

    /**
     * Converts a single command line to turtle compatible JSON object using a child process queue.
     *
     * @param {String} Input command
     *
     * @return {Object}
     */
    var convert = function (input, callback) {
        try {
            var emitter = new Bridge();
            var parser  = new Language(emitter.convert());
            parser.run(input);
            callback(null, emitter.buffer);
        } catch (err) {
            callback(err.toString().replace('Error: ', ''));
        }
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