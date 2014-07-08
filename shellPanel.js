//         _       __          __    _     __
//        (_)___  / /_  ____  / /_  (_)___/ /__  __  __
//       / / __ \/ __ \/ __ \/ __ \/ / __  / _ \/ / / /
//      / / /_/ / / / / / / / / / / / /_/ /  __/ /_/ /
//   __/ /\____/_/ /_/_/ /_/_/ /_/_/\__,_/\___/\__, /
//  /___/                                     /____/


/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, document */

define(function (require, exports, module) {

    var PanelManager        = brackets.getModule("view/PanelManager"),
        AppInit             = brackets.getModule("utils/AppInit"),
        KeyEvent            = brackets.getModule("utils/KeyEvent"),
        ProjectManager      = brackets.getModule("project/ProjectManager"),
        ShellPanelHtml      = require("text!shellPanel.html"),
        CommandTemplateHtml = require("text!commandTemplate.html"),
        Shell               = require('shell'),
        ShellPanel          = PanelManager
                            .createBottomPanel("hdy.brackets.shell.panel",
                                               $(ShellPanelHtml), 100);

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
        _focus();
    }

    function _hide() {
        ShellPanel.hide();
    }

    function _isVisible() {
        return ShellPanel.isVisible();
    }

    function _executeCommand(e) {

        var currentCommandGroup = $('.hdy-current'),
            currentCommand = $('.hdy-command', currentCommandGroup).text(),
            cwd = $('.hdy-command', currentCommandGroup).attr('data-cwd');

        if (e.which == KeyEvent.DOM_VK_RETURN) {
            e.preventDefault();

            if (currentCommand.trim()) {
                Shell.execute(currentCommand, cwd)
                    .done(function(result) {
                        _addShellLine(result.cwd.output.trim(), result.data.output.trim());
                    })
                    .fail(function(err) {
                        if (err) {
                            _addShellLine(err);
                            console.error(err);
                        } else {
                            _addShellLine();
                        }
                    });
            } else { _addShellLine(); }
        }

    }

    function _addShellLine(cwd, data) {

        var commandGroups = $('.hdy-commandGroups'),
            currentCommandGroup = $('.hdy-current'),
            currentCommand = $('.hdy-command', currentCommandGroup),
            currentCommandResult = $('.hdy-commandResult', currentCommandGroup),

            newCommandGroup = $(CommandTemplateHtml),
            newCommand = $('.hdy-command', newCommandGroup);

        if (data) {
            $('pre', currentCommandResult).text(data);
        } else {
            currentCommandResult.html('');
        }


        if (currentCommandGroup.length) {
            currentCommandGroup.removeClass('hdy-current');
            currentCommand.removeAttr('contenteditable');
        }

        newCommand.attr('data-content-before', (cwd || _getCommandPrompt()) + '>');
        commandGroups.append(newCommandGroup);

        _focus();

    }

    function _getCommandPrompt() {

        var currentPath = ProjectManager.getProjectRoot().fullPath;

        return currentPath.substring(0, currentPath.length-1);

    }

    function _focus() {

        var commandInput = $('.hdy-current .hdy-command');
        commandInput.focus();
    }

    // Initialize the shellPanel
    AppInit.appReady(function () {

        $('.close', ShellPanel.$panel).click(_toggle);
        $('.hdy-commandGroups .hdy-current .hdy-command').attr('data-cwd', 'C:\\');
        $('.hdy-commandGroups')
            .on('keydown', '.hdy-current .hdy-command', _executeCommand);

        _addShellLine();

    });

    exports.toggle = _toggle;
    exports.hide = _hide;
    exports.show = _show;
    exports.isVisible = _isVisible;

});
