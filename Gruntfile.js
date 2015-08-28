module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/webapp/**/*.js', '!**/node_modules/**/*', '!**/bower_components/**/*']
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    paths: ["src/webapp/styles"]
                },
                files: {"src/webapp/styles/main.css": "src/webapp/styles/**/*.less"}
            }
        },
        watch: {
            styles: {
                files: ['src/webapp/styles/**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less', 'watch']);
};
