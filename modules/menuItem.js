/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),

        PanelState              = require("panelState");

    function MenuItem(id, name, menu, position, section) {

        var self = this,
            _command,
            _commandCallback = function() {

                var state = !_command.getChecked() ? PanelState.Open : PanelState.Closed;

                if (self.panel) {
                    self.panel.setState(state);
                }

            };

        self.id     = id;
        self.panel  = undefined;
        self.setState = function(state) {

            _command.setChecked(state === PanelState.Open);

        };

        _command = CommandManager.register(name, id, _commandCallback);
        var viewMenu    = Menus.getMenu(menu);
        viewMenu.addMenuItem(id, "F4", position, section);

    }

    module.exports = MenuItem;

});
