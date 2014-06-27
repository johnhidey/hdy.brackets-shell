/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, document */

define(function (require, exports, module) {

    var PanelManager     = brackets.getModule("view/PanelManager"),
        AppInit          = brackets.getModule("utils/AppInit"),
        KeyEvent         = brackets.getModule("utils/KeyEvent"),
        ProjectManager   = brackets.getModule("project/ProjectManager"),
        ShellPanelHtml   = require("text!shellPanel.html"),
        ShellPanel       = PanelManager
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

    function _execute(e) {
        if (e.which == KeyEvent.DOM_VK_RETURN) {
            e.preventDefault();

            var currentCommandGroup = $('.hdy-current'),
                newCommandGroup = currentCommandGroup.clone(),
                currentCommand = $('.hdy-command', currentCommandGroup),
                newCommand = $('.hdy-command', newCommandGroup),
                newCommandResult = $('.hdy-commandResult', newCommandGroup),
                currentPath = ProjectManager.getProjectRoot().fullPath;

            currentCommandGroup.removeClass('hdy-current');
            currentCommand.removeAttr('contenteditable');
            currentCommandGroup.after(newCommandGroup);

            newCommand.attr('data-content-before', currentPath.substring(0, currentPath.length-1) + '>');
            newCommand.html('&nbsp;');
            newCommandResult.html('');

            _focus();

            return;
        }
    }

    function _getCommandPrompt() {

        var currentPath = ProjectManager.getProjectRoot().fullPath;

        return currentPath.substring(0, currentPath.length-1) + '>';

    }

    function _focus() {

        var commandInput = $('.hdy-commandGroups .hdy-current .hdy-command');

        commandInput.focus();
    }

    function _setupCommand() {

        var commandInput = $('.hdy-commandGroups .hdy-current .hdy-command');

        commandInput.attr('data-content-before', _getCommandPrompt());
        commandInput.html('&nbsp;');

    }

    // Initialize the shellPanel
    AppInit.appReady(function () {

        $('.close', ShellPanel.$panel).click(_toggle);
        $('.hdy-commandGroups').on('keydown', '.hdy-current .hdy-command', _execute);

        _setupCommand();
        _focus();

    });

    exports.toggle = _toggle;
    exports.hide = _hide;
    exports.show = _show;
    exports.isVisible = _isVisible;

});
