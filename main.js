/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit            = brackets.getModule("utils/AppInit"),
        ExtensionUtils     = brackets.getModule("utils/ExtensionUtils"),
        ProjectManager     = brackets.getModule("project/ProjectManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        Preferences        = PreferencesManager.getExtensionPrefs("hdy.brackets-shell"),
        $icon               = $("<a class='hdy-shell-icon' href='#'> </a>")
                                .attr("title", "Shell")
                                .appendTo($("#main-toolbar .buttons"));


    // Default theme if not defined
    if(Preferences.get("dark") === undefined) {
        Preferences.definePreference("dark", "boolean", false);
        Preferences.set("dark", false);
        Preferences.save();
    }

    // Default projectTracking if not defined
    if(Preferences.get("trackProject") === undefined) {
        Preferences.definePreference("trackProject", "boolean", true);
        Preferences.set("trackProject", true);
        Preferences.save();
    }

    if(Preferences.get("shell") === undefined) {
        Preferences.definePreference("shell", "string", "cmd.exe");
        if (brackets.platform === "win") {
            Preferences.set("shell", "cmd.exe");
        } else {
            Preferences.set("shell", "/bin/sh");
        }
        Preferences.save();
    }

    AppInit.appReady(function () {

        var projectWatcher  = require("projectWatcher"),
            commandShell    = require("shellPanel");

        require('./online').init();

        ExtensionUtils.loadStyleSheet(module, "styles/shellPanel.css");
        $icon.on("click", commandShell.toggle);

        commandShell.hide();
        commandShell.setDirectory(projectWatcher.cleanPath(ProjectManager.getProjectRoot().fullPath));

        if (Preferences.get("trackProject")) {
            projectWatcher.register(function(cwd) {
                if (cwd) {
                    commandShell.setDirectory(cwd);
                }
            });
        }

        projectWatcher.watch();

    });

});
