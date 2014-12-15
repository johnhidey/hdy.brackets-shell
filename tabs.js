/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var self;

    function _add(name) {

        self.name = name;

    }

    function _remove(name) {

        self.name = name;

    }

    function _initialize() { }

    var Tabs = function() {

        self = this;

        _initialize();

    };

    Tabs.prototype.add          = _add;
    Tabs.prototype.remove       = _remove;

    module.exports = Tabs;

});
