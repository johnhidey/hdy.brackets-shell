//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit         = brackets.getModule("utils/AppInit"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        _projectManager = brackets.getModule("project/ProjectManager"),
        $icon           = $("<a class='hdy-shell-icon' href='#'> </a>")
                            .attr("title", "Shell")
                            .appendTo($("#main-toolbar .buttons"));

    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        prefs = PreferencesManager.getExtensionPrefs("hdy.brackets-shell");

    // Default theme if not defined
    if(prefs.get("dark") === undefined) {
        prefs.definePreference("dark", "boolean", false);
        prefs.set("dark", false);
        prefs.save();
    }

    // Default projectTracking if not defined
    if(prefs.get("trackProject") === undefined) {
        prefs.definePreference("trackProject", "boolean", true);
        prefs.set("trackProject", true);
        prefs.save();
    }

    AppInit.appReady(function () {

        var projectWatcher  = require("projectWatcher");
        var commandShell    = require("shellPanel");

        ExtensionUtils.loadStyleSheet(module, "styles/shellPanel.css");
        $icon.on("click", commandShell.toggle);

        commandShell.hide();
        commandShell.setDirectory(projectWatcher.cleanPath(_projectManager.getProjectRoot().fullPath));

        if (prefs.get("trackProject")) {
            projectWatcher.register(function(cwd) {
                if (cwd) {
                    commandShell.setDirectory(cwd);
                }
            });
        }

        projectWatcher.watch();

    });

});
