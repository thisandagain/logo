/**
 * Worker process.
 *
 * @package logo
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var bridge      = require('./bridge'),
    language    = require('./language');

/**
 * Process
 */
process.on('message', function (input) {
    try {
        var emitter = new bridge();
        var parser  = new language(emitter.convert());
        parser.run(input);
        process.send({
            err: null,
            cmd: emitter.buffer
        });
    } catch (err) {
        process.send({
            err: err.toString().replace('Error: ', ''),
            cmd: null
        });
    }
});