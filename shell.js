/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, document */

define(function (require, exports, module) {

    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ShellDomain = new NodeDomain("hdyShell", ExtensionUtils.getModulePath(module, "node/hdyShellDomain"));


    function _execute(cmd) {
        return ShellDomain.exec('execute', cmd);
    }

    exports.execute = _execute;
});
