/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";

    var shell = require("shelljs");

    /**
    * @private
    * Handler function for the simple.getMemory command.
    * @param {boolean} total If true, return total memory; if false, return free memory only.
    * @return {number} The amount of memory.
    */
    function _execute(cmd) {

        shell.config.fatal = false;
        return shell.exec(cmd);

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
            "Execute the given command and result the results to the UI",
            [{
                name: "cmd", // parameters
                type: "string",
                description: "The command to be executed."
            }]
        );
    }

    exports.init = init;

}());
