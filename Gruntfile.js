/* globals module */
module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: 'build/<%= pkg.name %>-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                expand: true,
                src: ['**/*',
                    '!build/**',
                    '!node_modules/**',
                    '!tests/**',
                    '!Gruntfile.js',
                    '!package.json'
                ],
                dest: '/'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/splitargs/',
                        src: ['**/*'],
                        dest: 'node/splitargs/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/tree-kill/',
                        src: ['**/*'],
                        dest: 'node/tree-kill/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    // Load the plugin that provides the "compress" task.
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy']);

};