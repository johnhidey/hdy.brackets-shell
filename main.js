/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),

        Application         = require("application"),
        OnlineUsers         = require("online");

        ExtensionUtils.loadStyleSheet(module, "styles/bracketsShell.less");

    Application.boot();

    OnlineUsers.init();

    // Default theme if not defined
//    if(Preferences.get("dark") === undefined) {
//        Preferences.definePreference("dark", "boolean", false);
//        Preferences.set("dark", false);
//        Preferences.save();
//    }

    // Default projectTracking if not defined
//    if(Preferences.get("trackProject") === undefined) {
//        Preferences.definePreference("trackProject", "boolean", true);
//        Preferences.set("trackProject", true);
//        Preferences.save();
//    }

//    if(Preferences.get("shell") === undefined) {
//        Preferences.definePreference("shell", "string", "cmd.exe");
//        if (brackets.platform === "win") {
//            Preferences.set("shell", "cmd.exe");
//        } else {
//            Preferences.set("shell", "/bin/sh");
//        }
//        Preferences.save();
//    }

//    AppInit.appReady(function () {
//
//        var projectWatcher  = require("projectWatcher"),
//            ShellPanelView    = require("views/shellPanelView"),
//            commandShell = new ShellPanelView("My Title", projectWatcher.cleanPath(ProjectManager.getProjectRoot().fullPath));
//
//        require('./online').init();
//
//        ExtensionUtils.loadStyleSheet(module, "styles/shellPanel.css");
//        $icon.on("click", commandShell.toggle);
//
//        commandShell.hide();
//
//        if (Preferences.get("trackProject")) {
//            projectWatcher.register(function(cwd) {
//                if (cwd) {
//                    commandShell.cwd = cwd;
//                }
//            });
//        }
//
//        projectWatcher.watch();
//
//    });

});
