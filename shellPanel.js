/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets, document, window */

define(function (require, exports, module) {
    "use strict";

    var WorkspaceManager       = brackets.getModule("view/WorkspaceManager"),
        AppInit            = brackets.getModule("utils/AppInit"),
        KeyEvent            = brackets.getModule("utils/KeyEvent"),
        _shellPanelHtml      = require("text!templates/shellPanel.html"),
        $commandTemplateHtml = $(require("text!templates/commandTemplate.html")),
        ShellPanel          = WorkspaceManager.createBottomPanel("hdy.brackets.shell.panel",
                                                            $(_shellPanelHtml), 100),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        ShellDomain         = new NodeDomain("hdyShellDomain",
                                     ExtensionUtils.getModulePath(module,
                                                    "node/hdyShellDomain")),
        CommandRoll         = [],
        CommandRollIndex    = -1,
        KillProcess         = $('.hdy-brackets-shell-kill'),
        ansiFormat          = require("shellAnsiFormat"),
        _preferencesManager = brackets.getModule("preferences/PreferencesManager"),
        _preferences        = _preferencesManager.getExtensionPrefs("hdy.brackets-shell"),
        PROMPT_TERMINATOR   = ">";

    function _toggle() {
        if (ShellPanel.isVisible()) {
            _hide();
        }
        else {
            _show();
        }
    }

    function _show() {
        ShellPanel.show();
        $("a.hdy-shell-icon").removeClass("hdy-shell-icon-off");
        $("a.hdy-shell-icon").addClass("hdy-shell-icon-on");
        _focus();
    }

    function _hide() {
        $("a.hdy-shell-icon").removeClass("hdy-shell-icon-on");
        $("a.hdy-shell-icon").addClass("hdy-shell-icon-off");
        ShellPanel.hide();
    }

    function _isVisible() {
        return ShellPanel.isVisible();
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
                                 brackets.platform === "win",
                                 _preferences.get("shell"));

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

    function replaceCharAtIndex(str, index, newChar) {
        var array = str.split('');

        array[index] = newChar;

        return array.join('');
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

        if(ansiFormat.hasAceptedAnsiFormat(data)){
            ansiFormat.formattedText(data, currentCommandResult);
        } else {
            for (var i = 0; i < data.length; i++) {
                if (data.charCodeAt(i) === 65533) {
                    data = replaceCharAtIndex(data, i, ".");
                }
            }
            $("pre", currentCommandResult).append(document.createTextNode(data));
        }

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

        var element = $(".scrollPoint", currentCommandGroup);
        if (element.length) {
            currentCommandGroup[0].removeChild(element[0]);
        }
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
        var scrollPoint = $(".scrollPoint")[0];

        if (scrollPoint) {
            scrollPoint.scrollIntoView(false);
            commandInput.focus();
        }
    }

    // Initialize the shellPanel
    AppInit.appReady(function () {

        KillProcess.click(function() {
            ShellDomain.exec("kill");
        });
        KillProcess.attr('disabled', 'disabled');
        $(".close", ShellPanel.$panel).click(_toggle);
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

    exports.toggle = _toggle;
    exports.hide = _hide;
    exports.show = _show;
    exports.isVisible = _isVisible;
    exports.setDirectory = _setDirectory;
});
