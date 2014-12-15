/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets, document, window */

define(function (require, exports, module) {
    "use strict";

    var WorkspaceManager       = brackets.getModule("view/WorkspaceManager"),
        Shell                   = require("shell"),
        AppInit            = brackets.getModule("utils/AppInit"),
        KeyEvent            = brackets.getModule("utils/KeyEvent"),
        _shellPanelHtml      = require("text!templates/shellPanel.html"),
        $commandTemplateHtml = $(require("text!templates/commandTemplate.html")),
        ShellPanelBottom     = WorkspaceManager.createBottomPanel("hdy.brackets.shell.panel",
                                                            $(_shellPanelHtml), 100),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        ShellDomain         = new NodeDomain("hdyShellDomain",
                                     ExtensionUtils.getModulePath(module,
                                                    "../node/shellDomain")),
        CommandRoll         = [],
        CommandRollIndex    = -1,
        KillProcess         = $('.hdy-brackets-shell-kill'),
        _preferencesManager = brackets.getModule("preferences/PreferencesManager"),
        _preferences        = _preferencesManager.getExtensionPrefs("hdy.brackets-shell"),
        PROMPT_TERMINATOR   = ">";

    function ShellPanelView(title, cwd) {

        this.watch('title', function(prop, oldValue, newValue) {

            return newValue;
        });

        this.watch('cwd', function(prop, oldValue, newValue) {
            _addShellLine(newValue);

            return newValue;
        });

        this.shell = new Shell();

        this.shell.kill();

        this.title = title;
        this.cwd = cwd;
    }

    ShellPanelView.prototype.toggle = _toggle;
    ShellPanelView.prototype.show = _show;
    ShellPanelView.prototype.hide = _hide;
    ShellPanelView.prototype.isVisible = _isVisible;

    /*
    * object.watch v0.0.1: Cross-browser object.watch
    *
    * By Elijah Grey, http://eligrey.com
    *
    * A shim that partially implements object.watch and object.unwatch
    * in browsers that have accessor support.
    *
    * Public Domain.
    * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    */

    // object.watch
    if (!ShellPanelView.prototype.watch)
    {
        ShellPanelView.prototype.watch = function (prop, handler) {
            var oldval = this[prop], newval = oldval,
            getter = function () {
                return newval;
            },
            setter = function (val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) { // can't watch constants
                if (ShellPanelView.defineProperty) { // ECMAScript 5
                    ShellPanelView.defineProperty(this, prop, {
                        get: getter,
                        set: setter
                    });
                }
                else if (ShellPanelView.prototype.__defineGetter__ && ShellPanelView.prototype.__defineSetter__) { // legacy
                    ShellPanelView.prototype.__defineGetter__.call(this, prop, getter);
                    ShellPanelView.prototype.__defineSetter__.call(this, prop, setter);
                }
            }
        };
    }

    // object.unwatch
    if (!ShellPanelView.prototype.unwatch) {
        ShellPanelView.prototype.unwatch = function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        };
    }

    function _toggle() {
        if (ShellPanelBottom.isVisible()) {
            _hide();
        }
        else {
            _show();
        }
    }

    function _show() {
        ShellPanelBottom.show();
        $("a.hdy-shell-icon").removeClass("hdy-shell-icon-off");
        $("a.hdy-shell-icon").addClass("hdy-shell-icon-on");
        _focus();
    }

    function _hide() {
        $("a.hdy-shell-icon").removeClass("hdy-shell-icon-on");
        $("a.hdy-shell-icon").addClass("hdy-shell-icon-off");
        ShellPanelBottom.hide();
    }

    function _isVisible() {
        return ShellPanelBottom.isVisible();
    }

    function _executeCommand(e) {

        var currentCommandGroup = $(".hdy-current"),
            currentCommand = $(".hdy-command", currentCommandGroup),
            cwd = $(".hdy-command", currentCommandGroup).attr("data-cwd");

        if (e.which === KeyEvent.DOM_VK_RETURN) {
            e.preventDefault();

            cwd = cwd.substring(0, cwd.length-1);
            if (currentCommand.text().trim()) {

                currentCommand.removeAttr("contenteditable");

                KillProcess.removeAttr('disabled');
                ShellDomain.exec("execute",
                                 currentCommand.text(),
                                 cwd,
                                 brackets.platform === "win");

                CommandRoll.push(currentCommand.text());
                console.info(CommandRoll);
            }
            else {
                _addShellLine(cwd);
            }
        }

    }

    function _rollCommand(e) {

        var element = $(this);

        if (e.which === KeyEvent.DOM_VK_UP) {
            e.preventDefault();

            if (CommandRoll.length < 1) {
                return;
            }

            CommandRollIndex++;

            if (CommandRollIndex > CommandRoll.length - 1) {
                CommandRollIndex = 0;
            }

            _updateCommandLine(CommandRoll[CommandRollIndex]);
            _setCursorToEnd(element[0]);
        }

        if (e.which === KeyEvent.DOM_VK_DOWN) {
            e.preventDefault();

            if (CommandRoll.length < 1) {
                return;
            }

            CommandRollIndex--;

            if (CommandRollIndex < 0) {
                CommandRollIndex = CommandRoll.length - 1;
            }

            _updateCommandLine(CommandRoll[CommandRollIndex]);
            _setCursorToEnd(element[0]);
        }
    }

    function _updateCommandLine(cmd) {

        var currentCommandGroup = $(".hdy-current"),
            currentCommand = $(".hdy-command", currentCommandGroup);

            currentCommand.text(cmd);

    }

    $(ShellDomain).on("stdout", function(evt, data) {
        _addShellOutput(data);
    });

    $(ShellDomain).on("stderr", function(evt, data) {
        _addShellOutput(data);
    });

    $(ShellDomain).on("close", function(evt, dir) {
        _addShellLine(dir);

        KillProcess.attr('disabled', 'disabled');
    });

    $(ShellDomain).on("clear", function() {
        _clearOutput();
    });

    function _clearOutput() {

        var commandGroups = $(".hdy-command-groups"),
            removeCommands = $("div", commandGroups);

        removeCommands.remove();

    }

    function _addShellOutput(data) {

        var currentCommandGroup = $(".hdy-current"),
            currentCommandResult = $(".hdy-command-result",
                                     currentCommandGroup);

        if ($("pre", currentCommandResult).length === 0) {
            currentCommandResult.append($("<pre>"));
        }

        if (_preferences.get("dark")) {
            $("pre", currentCommandResult).addClass('hdy-dark-theme');
        }

        $("pre", currentCommandResult).append(document.createTextNode(data));
//        if(ansiFormat.hasAceptedAnsiFormat(data)){
//            ansiFormat.formattedText(data, currentCommandResult);
//        } else {
//            $("pre", currentCommandResult).append(document.createTextNode(data));
//        }

        _scrollToBottom();
    }

    function _addShellLine(cwd) {

        var commandGroups = $(".hdy-command-groups"),
            currentCommandGroup = $(".hdy-current"),
            newCommandGroup = $commandTemplateHtml.clone(),
            newCommand = $(".hdy-command", newCommandGroup);

        if (currentCommandGroup) {
            currentCommandGroup.removeClass("hdy-current");
        }

//        var element = $(".hdy-command-result:nth-last-of-type(1)", currentCommandGroup);
//        if (element.length) {
//            currentCommandGroup[0].removeChild(element[0]);
//        }
        newCommand.attr("data-cwd", cwd + PROMPT_TERMINATOR);
        commandGroups.append(newCommandGroup);

        _focus();

    }

    function _scrollToBottom() {

        var panel = $(".hdy-current")[0];
        panel.scrollIntoView(false);

    }

    function _focus() {

        var commandInput = $(".hdy-current .hdy-command")[0];

        commandInput.focus();
        commandInput.scrollIntoView(false);

    }

    // Initialize the ShellPanelBottom
    AppInit.appReady(function () {

        KillProcess.click(function() {
            ShellDomain.exec("kill");
        });
        KillProcess.attr('disabled', 'disabled');
        $(".close", ShellPanelBottom.$panel).click(_toggle);
//        $(".hdy-command-groups .hdy-current .hdy-command")
//            .attr("data-cwd", cwd);

        $(".hdy-command-groups").click(function() {
            var currentCommand = $(".hdy-current .hdy-command");

            if (currentCommand) {
                _focus();
            }
        });

        $(".hdy-command-groups")
            .on("keydown", ".hdy-current .hdy-command", _executeCommand);

        $(".hdy-command-groups")
            .on("keydown", ".hdy-current .hdy-command", _rollCommand);

    });

    function _setCursorToEnd(contentEditableElement)
    {
        var range,selection;

        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection

    }

    function _setDirectory(cwd) {
        _addShellLine(cwd);
    }

    module.exports = ShellPanelView;

//    exports.toggle = _toggle;
//    exports.hide = _hide;
//    exports.show = _show;
//    exports.isVisible = _isVisible;
//    exports.setDirectory = _setDirectory;
});
