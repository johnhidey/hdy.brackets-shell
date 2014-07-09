//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */

(function () {
    "use strict";

    var shell = require("shelljs");

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory; if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd, cwd) {

        var output,
            dir;

        shell.config.fatal = false;
        shell.cd(cwd);
        cmd = cmd.trim();

        if (cmd.slice(0, 3).toLowerCase() === 'cd ' ||
            cmd.slice(0, 3).toLowerCase() === 'cd.') {
            shell.cd(cmd.substring(2).trim());
            output = '';
            dir = process.cwd();
        }
        else {
            output = shell.exec(cmd).output;
            dir = cwd;
        }

        return {
            data: output,
            cwd: dir
        };

    }

    /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
    function init(domainManager) {
        if (!domainManager.hasDomain("hdyShell")) {
            domainManager.registerDomain("hdyShell", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "hdyShell", // domain name
            "execute", // command name
            _execute, // command handler function
            false, // isAsync
            "Execute the given command and return the results to the UI",
            [{
                name: "cmd",
                type: "string",
                description: "The command to be executed"
            },
            {
                name: "cwd", // parameters
                type: "string",
                description: "Directory in which the command is executed"
            }]
        );


    }

    exports.init = init;

}());
