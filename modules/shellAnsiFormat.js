/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50, unparam: true, node: true */
/*global define, $, document */

/*
Reference Links:
    http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    http://bluesock.org/~willg/dev/ansi.html
*/
define(function (require, exports) {
    "use strict";

    var _regExp = /\u001B\[(3|4)(0|1|2|3|4|5|6|7|9)m/i;

    function _hasAceptedAnsiFormat(value) {

        return (value) ? _regExp.test(value) : false;

    }

//    function _removeNonSupportedSpecialChars(data) {
//
//        var text    = data.concat("");
//            text    = text.replace(/\u001B\[((1|2|4|5|6|7|8|9|10)?(1|2|4|5|6|7|8|9))m/ig, "");
//
//        return text;
//
//    }

    function _formattedText(data, currentCommandResult) {

        var path        = /\u001B\[(3|4)(0|1|2|3|4|5|6|7|9)m/i,
            text        = data.concat(""),
            index       = text.search(path),
            index2      = -1,
            code        = "",
            prevText    = "",
            span;

        while(index > -1) {

            prevText = text.substr(0, index);
            if(prevText && prevText.length) {
                $("pre", currentCommandResult).append(document.createTextNode(prevText));
            }

            code = text.substr(index, 5);
            text = text.substr(index + 5);

            span = document.createElement("span");
            span.className = _getFormat(code);
            index2 = text.search(path);
            $("pre", currentCommandResult).append(document.createTextNode(prevText));

            if(index2 > -1) {
                span.textContent += text.substr(0, index2);
                text = text.substr(index2);
                index2 = 0;
            } else {
                span.textContent += text;
            }

            $("pre", currentCommandResult).append(span);
            index = index2;

        }
    }

    function _getFormat(data) {

        var color   = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "default", "default"],
            n       = parseInt(data.charAt(3)),
            nn      = parseInt(data.charAt(2)),
            txt     = (nn == 4) ? "bgr-" : "";

            return "hdy-" + txt + color[n];

    }

    exports.hasAceptedAnsiFormat = _hasAceptedAnsiFormat;
    exports.formattedText = _formattedText;

});
