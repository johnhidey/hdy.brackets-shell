/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),

        Tab                 = require("tab");


    ExtensionUtils.loadStyleSheet(module, "../styles/tabs.less");
    require("droptabs");

    function Tabs(id, tabsTemplate) {

        var self = this,
            _tabs = [];

        function _renderTab(tab) {

//            var compiledTemplate    = Mustache.render(templateHtml, self),
//                $compiledTemplate   = $(compiledTemplate),
//                $toolbar            = $("#hdy-brackets-shell-panel .toolbar"),
//                $title              = $("#hdy-brackets-shell-panel .title"),
//                $close              = $("#hdy-brackets-shell-panel .close");
//
//            $title.remove();
//            $close.remove();
//
//            $compiledTemplate.find(".span9").prepend($title);
//            $compiledTemplate.append($close);
//
//            $toolbar.append($compiledTemplate);

        }

        self.id     = id;

        self.add = function(tab) {
            _tabs.push(tab);
            _renderTab(tab);
        };

        self.draw = function() {

            var control;

            require(["text!" + tabsTemplate], function(templateHtml) {

                var compiledTemplate    = Mustache.render(templateHtml, self),
                    $compiledTemplate   = $(compiledTemplate),
                    $toolbar            = $("#hdy-brackets-shell-panel .toolbar"),
                    $title              = $("#hdy-brackets-shell-panel .title"),
                    $close              = $("#hdy-brackets-shell-panel .close");

                $title.remove();
                $close.remove();

//                $compiledTemplate.find(".span9").prepend($title);

                $toolbar.append($compiledTemplate);
                $compiledTemplate.append($close);

                $("#hdy-brackets-shell-panel .droptabs").droptabs();

                for (var controlIndex in self.controls) {
                    control = self.controls[controlIndex];

                    if (control && control.draw) {
                        control.draw();
                    }
                }

            });

        };

    }

    module.exports = Tabs;

});
