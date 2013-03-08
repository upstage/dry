/*
 * Dry
 * http://github.com/assemble/dry
 * Convert your CSS to LESS and DRY up your stylesheets.
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */


'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
              ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: { jshintrc: '.jshintrc' },
      files: ['lib/**/*.js', 'test/**/*.js', 'Gruntfile.js']
    },

    concat: {
      banner:
      dist: {
        src: [
          '<banner:meta.banner>',
          '<file_strip_banner:lib/dry.js>',
          'src/dry.js',
          'src/rules/*.js',
          'src/build/footer.js'
        ],
        dest: 'tasks/dry.js'
      }
    },

    uglify: {
      options: { mangle: false },
      plugin: {
        files: {
          'dist/<%= pkg.name %>-<%= pkg.version %>.js' : ['<%= concat.dest %>']
        }
      }
    },

    dry: {
      // options: {
      //   variables: true,
      //   nesting: true
      // },
      tests: {
        files: {
          'test/results/test.less': [ 'test/fixtures/bootstrap.css' ]
        }
      }
    },

    watch: {
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', [
    'concat',
    'uglify',
    'test'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'nodeunit',
    'jshint',
    'dry:tests'
  ]);
};
