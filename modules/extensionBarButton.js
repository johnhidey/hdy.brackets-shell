/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $ */

define(function (require, exports, module) {
    "use strict";

    var PanelState        = require("panelState");

    function ExtensionBarButton(id, tooltip) {

        var self    = this,
            _state  = PanelState.Closed;

        self.id = id;
        self.panel = undefined;
        self.$icon = $("<a id='" + id + "' href='#'></a>")
                        .attr("title", tooltip);
        self.$icon.appendTo($("#main-toolbar .buttons"));

        self.setState = function(state) {

            _state = state;
            self.$icon.removeClass();
            self.$icon.addClass(state);

        };

        self.$icon.on("click", function() {

            var state = (_state === PanelState.Closed) ? PanelState.Open : PanelState.Closed;

            if (self.panel) {
                self.panel.setState(state);
            }
        });

    }

    module.exports = ExtensionBarButton;

});

