//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/


/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ShellDomain = new NodeDomain("hdyShell",
                                     ExtensionUtils.getModulePath(module,
                                                    "node/hdyShellDomain"));


    function _execute(cmd, cwd) {
        var result = ShellDomain.exec("execute", cmd, cwd);


        return result;
    }

    exports.execute = _execute;
});
