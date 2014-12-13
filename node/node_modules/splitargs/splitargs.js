/**
 * Created by elgs on 7/2/14.
 */

(function () {
    "use strict";

    module.exports = function (input, separator) {
        separator = separator || /\s/g;
        var singleQuoteOpen = false;
        var doubleQuoteOpen = false;
        var tokenBuffer = [];
        var ret = [];

        var arr = input.split('');
        for (var i = 0; i < arr.length; ++i) {
            var element = arr[i];
            var matches = element.match(separator);
            if (element === "'") {
                if (!doubleQuoteOpen) {
                    singleQuoteOpen = !singleQuoteOpen;
//                    if (!singleQuoteOpen) {
//                        ret.push(tokenBuffer.join(''));
//                        tokenBuffer = [];
//                    }
                    continue;
                }
            } else if (element === '"') {
                if (!singleQuoteOpen) {
                    doubleQuoteOpen = !doubleQuoteOpen;
//                    if (!doubleQuoteOpen) {
//                        ret.push(tokenBuffer.join(''));
//                        tokenBuffer = [];
//                    }
                    continue;
                }
            }

            if (!singleQuoteOpen && !doubleQuoteOpen) {
                if (matches) {
                    if (tokenBuffer && tokenBuffer.length > 0) {
                        ret.push(tokenBuffer.join(''));
                        tokenBuffer = [];
                    }
                } else {
                    tokenBuffer.push(element);
                }
            } else if (singleQuoteOpen) {
                tokenBuffer.push(element);
            } else if (doubleQuoteOpen) {
                tokenBuffer.push(element);
            }
        }
        if (tokenBuffer && tokenBuffer.length > 0) {
            ret.push(tokenBuffer.join(''));
        }
        return ret;
    };
})();