/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, Mustache */

define(function (require, exports, module) {
    "use strict";

    var Tab = function(name, tabTemplate) {

        var self = this;

        self.name       = name;

        self.rename = function(name) {
            self.name = name;
        };

        self.draw = function() {

            var control;

            require(["text!" + tabTemplate], function(templateHtml) {

                var compiledTemplate = Mustache.render(templateHtml, self);

                for (var controlIndex in self.controls) {
                    control = self.controls[controlIndex];

                    if (control && control.draw) {
                        control.draw();
                    }
                }

            });

        };

    };

    module.exports = Tab;

});
