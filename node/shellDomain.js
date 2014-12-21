/* globals require, process, exports */

(function() {
    "use strict";


    var _domainManager,
        child,
        kill = require("tree-kill"),
        ansi = require("ansi-webkit");

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory;
                       if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd) {

        var spawn   = require("child_process").spawn,
            dir     = cmd.cwd,
            text    = cmd.cmd,
            args    = cmd.cmd ? "/c" : "-c",
            shell   = cmd.shell ? "cmd.exe" : cmd.shell,
            isWin   = !cmd.shell || cmd.shell.trim().toLowerCase() === "cmd.exe",
            env     = process.env;

        // Are we changing directories?  If so we need
        // to handle that in a special way.
        // TODO: Might need to change this.
        if (text.slice(0, 3).toLowerCase() === "cd ") {

            try {
                process.chdir(dir);
                process.chdir(text.substring(2).trim());
                dir = process.cwd();
            }
            catch (e) {}

        }

        // clearing the console with clear or clr?
        if ((text.toLowerCase() === "clear" && !isWin) ||
            (text.toLowerCase() === "cls" && isWin)) {

            _domainManager.emitEvent("hdyShellDomain", "clear");
        }

        child = spawn(shell, [args, text], { cwd: dir, env: env, stdio: 'inherit' });

        process.stdout.on("data", function (data) {
            var parsedOutput = ansi.parse(data.toString().trim());

            _domainManager.emitEvent("hdyShellDomain", "stdout", [parsedOutput]);
        });

        process.stderr.on("data", function (data) {
            var parsedOutput = ansi.parse(data.toString().trim());

            _domainManager.emitEvent("hdyShellDomain", "stderr", [parsedOutput]);
        });

        process.on("close", function () {
            child.kill();
            _domainManager.emitEvent("hdyShellDomain", "close", [dir]);
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
