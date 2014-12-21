## Change Log

### v0.0.12
* FEATURE: Usage tracking added to application
* DOC: Update doc in CHANGELOG
* BUGFIX: Minor UI enhancement to add left margin to the shell output

### v0.0.11
* BUGFIX: Fixed bug where spawn close event callback was erroring

### v0.0.10
* BUGFIX: Added feature for being able to specify the shell to use resolves the one outstanding issue with running on the *nix platform
* FEATURE: Updated *nix support for using different shells. The preference 'hdy.brackets-shell.shell is the string path
to the shell to be used.  On Windows machines this will default to "cmd.exe" and on *nix machines this will default to
"/bin/sh". If you wish to you a different shell, say bash, just set this value to something like '/bin/bash'

### v0.0.9
* BUGFIX: Replace character with charCode 65533 to avoid showing garbage on command result on Windows (10?)
* DOC: updated readme file with extension options and usage
* BUGFIX: Finally have *nix platforms environment pulling it. I have verified this on a Ubuntu 14 x64 installation. Currently
only support the sh (Bourne) shell.

### v0.0.8
* BUGFIX: Prompt will not focus when you click anywhere within the shell panel
* BUGFIX: Prompt disables immediately after pressing enter to prevent the accidently
entry of multiple commands

### v0.0.7
* HOTFIX: Deployment issue fixed for version v0.0.5

### v0.0.5
* BUGFIX: Change the way the command are actually executed from child_process.exec to
child_process.spawn
* BUGFIX: Fixed scrollbar scrolling down beyound visible panel.
* FEATURE: ANSI console color support added [ANSI Escape Codes](http://en.wikipedia.org/wiki/ANSI_escape_code#Colors).
Many thanks to Andres Lozada Mosto @alfathenus for adding this
* FEATURE: Added setting to support dark theme. (Thanks again to Andres Lozada Mosto @alfathenus)
* FEATURE: Added kill process to title bar of console

### v0.0.4
* BUGFIX: Resolved issue when attempting to browse to directory which doesn't
nothing would happen. This now returns an error for display
* FEATURE: Color coded all errors that occur in the shell to be a red color.
This will help them stand out and make it easier to identify them

### v0.0.3
* FEATURE: Added support for command history. Up and down arrows will not
cycle through all previously issued commands

### v0.0.2
* BUGFIX: Long running process support (Now listening to STDOUT)
* Removed dependency on ShellJS. Now working directly with nodes client process
* FEATURE: Added toggle indicator with colored icon when panel is showing
* FEATURE: Added support for CLS in Windows and CLEAR in *nix platforms

### v0.0.1
* Initial Release
