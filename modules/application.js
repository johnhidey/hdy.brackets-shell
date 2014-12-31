/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var Menus                   = brackets.getModule("command/Menus"),

        Strings                 = require("strings"),
        MenuItem                = require("menuItem"),
        CommandId               = require("commandId"),
        ExtensionBarButton      = require("extensionBarButton"),
        Panel                   = require("panel"),
        PanelState              = require("panelState"),

        _viewShellMenuItem,
        _viewShellButton,
        _panel;

    module.exports.boot = function() {

        _panel              = new Panel("hdy.brackets.shell.panel",
                                        "shellTemplate",
                                        PanelState.Closed);

        _viewShellButton    = new ExtensionBarButton("hdy-brackets-shell-toolbar-icon",
                                                     Strings.TOOLTIP_TOOLBAR_ICON);

        _viewShellMenuItem  = new MenuItem(CommandId.VIEW_SHELL_COMMAND,
                                            Strings.MENU_VIEW_SHELL,
                                            Menus.AppMenuBar.VIEW_MENU,
                                            Menus.LAST_IN_SECTION,
                                            Menus.MenuSection.VIEW_HIDESHOW_COMMANDS);

        _panel.registerForStateChangeNotification(_viewShellButton);
        _panel.registerForStateChangeNotification(_viewShellMenuItem);

    };

});
