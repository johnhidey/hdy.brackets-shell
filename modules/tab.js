/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Tab = function(name, tabTemplate) {

        var self = this;

        self.name       = name;

        self.rename = function(name) {
            self.name = name;
        };

    };

    module.exports = Tab;

});
