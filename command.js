/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var self;

    var Command = function(cmd, cwd, shell) {

        self = this;

        self.cmd    = cmd;
        self.cwd    = cwd;
        self.shell  = shell;

    };

    module.exports = Command;

});
