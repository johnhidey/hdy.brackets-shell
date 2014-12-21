/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var self,
        Shell = require("shell");

    function _rename(name) {

        self.name = name;

    }

    function _initialize() {

        self.shell = new Shell();
    }

    var Tab = function(name, options) {

        var self    = this,
            Shell = require("shell");

        self.shell   = new Shell();
        self.name       = name;

        _initialize();

    };

    Tab.prototype.rename          = _rename;

    module.exports = Tab;

});
