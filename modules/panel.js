/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

define(function (require, exports, module) {
    "use strict";

    var WorkspaceManager        = brackets.getModule("view/WorkspaceManager"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),

        PanelState              = require("panelState");


    ExtensionUtils.loadStyleSheet(module, "../styles/panel.less");

    function Panel(id, title, panelTemplate, state) {

        var self = this,
            _observers = {},
            _panel;

        if (!state) {
            state = PanelState.Closed;
        }

        self.id = id;
        self.state = state;
        self.title = title;
        self.controls = [];

        self.draw = function() {

            require(["text!" + panelTemplate], function(templateHtml) {

                var compiledTemplate = Mustache.render(templateHtml, self),
                    control;

                _panel = WorkspaceManager.createBottomPanel(id,
                                                            $(compiledTemplate),
                                                            100);

                if (_panel) {
                    _panel.setVisible(state === PanelState.Open);

                    $(".hdy-brackets-shell-panel .close").on("click", function() {
                        self.setState(PanelState.Closed);
                    });
                }

                for (var controlIndex in self.controls) {
                    control = self.controls[controlIndex];

                    if (control && control.draw) {
                        control.draw();
                    }
                }

            });

        };

        self.register = function(observer) {

            _observers[observer.id] = observer;
            observer.panel = {
                'setState': self.setState
            };

            observer.setState(self.state);

        };

        self.setState = function(state) {

            if (_panel) {
                _panel.setVisible(state === PanelState.Open);
            }

            for (var subscriber in _observers) {
                _observers[subscriber].setState(state);
            }

        };

        self.setState(state);

    }

    module.exports = Panel;

});
