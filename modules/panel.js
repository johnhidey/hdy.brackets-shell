/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var WorkspaceManager        = brackets.getModule("view/WorkspaceManager"),

        PanelState              = require("panelState");

    function Panel(id, panelTemplate, state) {

        var self = this,
            _stateChangedObservers = {},
            _panel;

        if (!state) {
            state = PanelState.Closed;
        }

        self.id = id;
        self.state = state;

        self.registerForStateChangeNotification = function(observer) {

            _stateChangedObservers[observer.id] = observer;
            observer.panel = {
                'setState': self.setState
            };

            observer.setState(self.state);
        };

        self.setState = function(state) {

            if (_panel) {
                _panel.setVisible(state === PanelState.Open);
            }

            for (var subscriber in _stateChangedObservers) {
                _stateChangedObservers[subscriber].setState(state);
            }

        };

        if (state) {
            self.setState(state);
        }

        require(["text!" + panelTemplate], function(templateHtml) {
            _panel = WorkspaceManager.createBottomPanel(id,
                                                              $(templateHtml),
                                                              100);

            _panel.setVisible(state === PanelState.Open);

            $(".close", _panel.$panel).on('click', function() {
                self.setState(PanelState.Closed);
            });

        });
    }

    module.exports = Panel;

});
