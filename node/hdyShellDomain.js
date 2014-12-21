/* globals require, process, exports */

(function() {
    "use strict";

    var _domainManager,
        child,
        kill = require("tree-kill");

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory;
                       if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd, cwd, isWin, shell) {

        var spawn = require("child_process").spawn,
            args,
            enddir = cwd,
            tempdir;

        cmd = cmd.trim();

        // Are we changing directories?  If so we need
        // to handle that in a special way.
        if (cmd.slice(0, 3).toLowerCase() === "cd ") {

            try {
                process.chdir(cwd);
                tempdir = cmd.substring(2).trim();
                process.chdir(tempdir);
                enddir = process.cwd();
            }
            catch (e) {}

        }

        // clearing the console with clear or clr?
        if ((cmd.toLowerCase() === "clear" && !isWin) ||
            (cmd.toLowerCase() === "cls" && isWin)) {

            _domainManager.emitEvent("hdyShellDomain", "clear");
        }

        if (isWin) {
            args = ["/c", cmd];
            cmd = shell;
        }
        else {
            args = ["-c", cmd];
            cmd = shell;
        }

        child = spawn(cmd, args, { cwd: cwd, env: process.env });

        child.stdout.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stdout", [data.toString()]);
        });

        child.stderr.on("data", function (data) {
            _domainManager.emitEvent("hdyShellDomain", "stderr", [data.toString()]);
        });

        child.on("close", function () {
            child.kill();
            _domainManager.emitEvent("hdyShellDomain", "close", [enddir]);
        });

    }

    function _kill() {

        //SIGKILL, SIGTERM, SIGABRT, SIGHUP, SIGINT and SIGQUIT
        if (child && child.pid) {
            kill(child.pid);
        }
    }

    function _detach() {

        if (child) {
            child.disconnect();
        }

    }

    /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
    function _init(domainManager) {

        if (!domainManager.hasDomain("hdyShellDomain")) {
            domainManager.registerDomain("hdyShellDomain", {major: 0, minor: 12});
        }

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "kill", // command name
            _kill, // command handler function
            true, // isAsync
            "Kill the current executing process",
            []
        );

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "detach", // command name
            _detach, // command handler function
            true, // isAsync
            "Detach current running process from brackets shell",
            []
        );

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "execute", // command name
            _execute, // command handler function
            true, // isAsync
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
            },
            {
                name: "isWin",
                type: "boolean",
                description: "Is Windows System ?"
            },
            {
                name: "shell",
                type: "string",
                description: "Path of the Shell used to execute the commands"
            }]
        );

        domainManager.registerEvent("hdyShellDomain",
                                    "stdout",
                                    [{name: "data", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "stderr",
                                    [{name: "err", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "close",
                                    [{name: "enddir", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "clear",
                                    []);

        _domainManager = domainManager;
    }

    exports.init = _init;

}());
