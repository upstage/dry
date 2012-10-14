module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      beforeConcat: ['grunt.js', 'src/*.js'],
      afterConcat: ['release/**/*.js', 'test/**/*.js']
    },
    concat: {
      node: {
        src: ['src/node/header.js', 'src/dry.js', 'src/rules/*.js', 'src/node/footer.js'],
        dest: 'release/dry-node.js'
      }
    },
    watch: {
      files: '<config:concat.node.src>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint:beforeConcat concat:node lint:afterConcat test');

};