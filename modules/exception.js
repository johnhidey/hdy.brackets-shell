/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Exception = function(message) {

        this.message = "hdyException: " + message;

    };

    module.exports = Exception;

});
