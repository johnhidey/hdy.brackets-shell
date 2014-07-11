//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/


/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define, $, brackets, document, window */

define(function (require, exports, module) {
    "use strict";

    var PanelManager        = brackets.getModule("view/PanelManager"),
        AppInit             = brackets.getModule("utils/AppInit"),
        KeyEvent            = brackets.getModule("utils/KeyEvent"),
        ProjectManager      = brackets.getModule("project/ProjectManager"),
        ShellPanelHtml      = require("text!templates/shellPanel.html"),
        CommandTemplateHtml = require("text!templates/commandTemplate.html"),
        ShellPanel          = PanelManager
                                .createBottomPanel("hdy.brackets.shell.panel",
                                               $(ShellPanelHtml), 100),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        ShellDomain         = new NodeDomain("hdyShellDomain",
                                     ExtensionUtils.getModulePath(module,
                                                    "node/hdyShellDomain")),
        PROMPT_TERMINATOR   = ">",
        CommandRoll         = [],
        CommandRollIndex    = -1;


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
            currentCommand = $(".hdy-command", currentCommandGroup).text(),
            cwd = $(".hdy-command", currentCommandGroup).attr("data-cwd");

        if (e.which === KeyEvent.DOM_VK_RETURN) {
            e.preventDefault();

            cwd = cwd.substring(0, cwd.length-1);
            if (currentCommand.trim()) {
                ShellDomain.exec("execute",
                                 currentCommand,
                                 cwd,
                                 brackets.platform === "win");

                CommandRoll.push(currentCommand);
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

    $(ShellDomain).on("exit", function(evt, dir) {
        _addShellLine(dir);
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

        $("pre", currentCommandResult).append(document.createTextNode(data));
    }

    function _addShellLine(cwd) {

        var commandGroups = $(".hdy-command-groups"),
            currentCommandGroup = $(".hdy-current"),
            currentCommand = $(".hdy-command", currentCommandGroup),

            newCommandGroup = $(CommandTemplateHtml),
            newCommand = $(".hdy-command", newCommandGroup);

        if (currentCommandGroup.length) {
            currentCommandGroup.removeClass("hdy-current");
            currentCommand.removeAttr("contenteditable");
        }

        newCommand.attr("data-cwd", _getCommandPrompt(cwd));
        commandGroups.append(newCommandGroup);

        _focus();

    }

    function _getCommandPrompt(cwd) {

        // remove trailing directory separator if present
        var projectDir = ProjectManager.getProjectRoot().fullPath;
        if (projectDir.substr(projectDir.length-1, 1) === "/") {
            projectDir = projectDir.substring(0, projectDir.length-1);
        }

        // remmove path terminator
        if (cwd && cwd.substr(cwd.length-1, 1) === PROMPT_TERMINATOR) {
            cwd = cwd.substring(0, cwd.length-1);
        }

        var currentPath = cwd || projectDir;

        if (brackets.platform === "win") {
            currentPath = currentPath.replace(/\//g, "\\");
        }

        return currentPath + PROMPT_TERMINATOR;
    }

    function _focus() {

        var commandInput = $(".hdy-current .hdy-command");
        commandInput.focus();
    }

    // Initialize the shellPanel
    AppInit.appReady(function () {

        var cwd = _getCommandPrompt();

        $(".close", ShellPanel.$panel).click(_toggle);
        $(".hdy-command-groups .hdy-current .hdy-command")
            .attr("data-cwd", cwd);

        $(".hdy-command-groups")
            .on("keydown", ".hdy-current .hdy-command", _executeCommand);

        $(".hdy-command-groups")
            .on("keydown", ".hdy-current .hdy-command", _rollCommand);

        _addShellLine(cwd);

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

    exports.toggle = _toggle;
    exports.hide = _hide;
    exports.show = _show;
    exports.isVisible = _isVisible;

});
