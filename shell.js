/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        ShellDomain         = new NodeDomain("ShellDomain",
                                      ExtensionUtils.getModulePath(module,
                                          "node/shellDomain")),
        self;

    function _execute(cwd, cmd, isWindows) {

        ShellDomain.exec("execute", cmd, cwd, isWindows);

    }

    function _onStdOut(callback) {

        self._onStdOutCallback = callback;

    }

    function _onStdErr(callback) {

        self._onStdErrCallback = callback;

    }

    function _onClose(callback) {

        self._onCloseCallback = callback;

    }

    function _onClear(callback) {

        self._onClearCallback = callback;

    }

    function _kill() {

        ShellDomain.exec("kill");

    }

    function _initialize() {

        $(ShellDomain).on("stdout", function(evt, data) {

            if (self._onStdOutCallback) {
                self._onStdOutCallback(data);
            }

        });

        $(ShellDomain).on("stderr", function(evt, data) {

            if (self._onStdErrCallback) {
                self._onStdErrCallback(data);
            }

        });

        $(ShellDomain).on("close", function(evt, dir) {

            if (self._onCloseCallback) {
                self._onCloseCallback(dir);
            }

        });

        $(ShellDomain).on("clear", function() {

            if (self._onClearCallback) {
                self._onClearCallback();
            }

        });
    }

    var Shell = function() {

        self = this;

        _initialize();

    };

    Shell.prototype.execute         = _execute;
    Shell.prototype.kill            = _kill;
    Shell.prototype.onStdOut        = _onStdOut;
    Shell.prototype.onStdErr        = _onStdErr;
    Shell.prototype.onClose         = _onClose;
    Shell.prototype.onClear         = _onClear;

    module.exports = Shell;

});
