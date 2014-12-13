/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports) {
    "use strict";

    var ProjectManager         = brackets.getModule("project/ProjectManager"),
        AppInit                = brackets.getModule("utils/AppInit"),
        _projectOpenSubscribers = [];


    function _watch() {

        $(ProjectManager).on("projectOpen", function(evt, data) {

            var cwd = _cleanPath(data._path);

            for(var index in _projectOpenSubscribers) {
                 _projectOpenSubscribers[index](cwd);
             }
        });

    }

    function _cleanPath(cwd) {

        if (cwd.substr(cwd.length-1, 1) === "/") {
            cwd = cwd.substring(0, cwd.length-1);
        }

        if (brackets.platform === "win") {
            cwd = cwd.replace(/\//g, "\\");
        }

        return cwd;
    }

    function _isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
    }

    function _register(callback) {

        if (_isFunction(callback)) {
            _projectOpenSubscribers.push(callback);
        }
    }

    AppInit.appReady(function () {
    });

    exports.register = _register;
    exports.watch = _watch;
    exports.cleanPath = _cleanPath;
//    exports.cwd = _getCurrentDirectory;

});
