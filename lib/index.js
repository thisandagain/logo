/**
 * A streaming parser for the LOGO programming language.
 *
 * @package logo
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async       = require('async'),
    Bridge      = require('./bridge'),
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
    function Buffer () {
        var self        = this;

        // Stream setup
        self.writable   = true;
        self.readable   = true;

        // Processor
        self.process    = function (buffer, callback) {
            var set = buffer.toString().split('\n');
            async.forEachSeries(set, function (obj, callback) {
                convert(obj, function (err, result) {
                    if (err) {
                        self.emit('data', JSON.stringify([{error: err}]));
                    } else {
                        self.emit('data', JSON.stringify(result));
                    }
                    callback();
                });
            }, callback);
        }
    }

    require('util').inherits(Buffer, require('stream'));

    Buffer.prototype.write = function (data) {
        var self = this;

        self.process(data, function (err) {
            if (err) return self.emit('error', err);
            self.emit('drain');
        });
        
        return false;
    };

    Buffer.prototype.end = function () {
        this.emit('end');
    };

    // -----------------------
    // -----------------------

    return {
        convert:    convert,
        stream:     new Buffer()
    }

}();