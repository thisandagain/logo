 /**
 * Translates instructions from the logo interpreter into a command stream.
 *
 * @package logo
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Extracts a string using lead and tail removal spec.
 *
 * @param {String} Input string
 * @param {String} Leading string (will not be returned)
 * @param {String} Tail string (will not be returned)
 *
 * @return {String}
 */
var extract = function (input, lead, tail) {
    return input.match(lead + '(.*?)' + tail)[1];
};

/**
 * Constructor
 */
function Bridge () {
    var self = this;

    this.buffer         = [];
    this.commands       = ['begin', 'end', 'move', 'turn', 'setposition', 'setheading', 'home', 'arc', 'showturtle' , 'hideturtle', 'clear', 'clearscreen', 'pendown', 'penup', 'setpenmode', 'setpencolor', 'setwidth', 'setcolor'];
    this.limit          = 25000;

    /**
     * Supplies drawing functions to the language interpreter and parses input in order to create a command buffer.
     *
     * @return {Object}
     */
    this.convert = function () {
        var a = {};

        for (var i = 0; i < self.commands.length; i++) {
            a[self.commands[i]] = null;
        }

        for (var item in a) {
            a[item] = function () {
                // Parse method
                var method  = extract(arguments.callee.caller.toString(), 'turtle\\.', '\\(');
                if (method === 'begin' && self.buffer.length > 0) method = 'end';

                // Build command
                var args    = Array.prototype.slice.call(arguments);
                var command = new Object(null);
                command[method] = args;
                
                // Push command to buffer
                if (self.buffer.length < self.limit) {
                    self.buffer.push(command);
                }
            };
        }

        return a;
    };
};

/**
 * Export
 */
module.exports = Bridge;
