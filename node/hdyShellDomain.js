//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
(function() {
    "use strict";

    var _domainManager;

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory;
                       if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd, cwd) {

        var exec = require("child_process").exec,
            dir,
            child;

        cmd = cmd.trim();

        // Are we changing directories?  If so we need
        // to handle that in a special way.
        if (cmd.slice(0, 3).toLowerCase() === "cd " ||
            cmd.slice(0, 3).toLowerCase() === "cd.") {

            cmd = cmd.substring(2).trim();
            process.cwd(cwd);
            dir = process.cwd();

        }

        child = exec(cmd, { cwd: cwd });

        child.stdout.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stdout", [data]);
        });

        child.stderr.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stderr", [data]);
        });

        child.on("close", function () {
            _domainManager.emitEvent("hdyShellDomain", "exit", [dir]);
        });

    }

    /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
    function _init(domainManager) {

        if (!domainManager.hasDomain("hdyShellDomain")) {
            domainManager.registerDomain("hdyShellDomain", {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
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
                name: "cwd",
                type: "string",
                description: "Directory in which the command is executed"
            }]
        );

        domainManager.registerEvent("hdyShellDomain",
                                    "stdout",
                                    [{name: "data", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "stderr",
                                    [{name: "err", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "exit",
                                    [{name: "dir", type: "string"}]);

        _domainManager = domainManager;
    }

    exports.init = _init;

}());
