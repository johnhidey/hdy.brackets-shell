/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var self;

    function _rename(name) {

        self.name = name;

    }

    function _initialize() { }

    var Tab = function(name) {

        self = this;
        self.name       = name;

        _initialize();

    };

    Tab.prototype.rename          = _rename;

    module.exports = Tab;

});
