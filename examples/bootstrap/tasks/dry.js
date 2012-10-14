
module.exports = function(grunt) {

  // External libs.
  var dry = require('../../../release/dry-node.js');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('dry', 'Refactor CSS files into LESS files.', function() {

    grunt.log.writeln('Processing all files...');
    
    var taskDone = this.async();
    var files = grunt.file.expandFiles(this.file.src);
    var fileCount = files.length;
    var filesComplete = 0;

    files.forEach(function(filepath) {
      var source = filepath;
      var destination = source.replace(/\.css/, '.less');

      dry.refactor(source, destination, function(errorCount){
        grunt.log.writeln('Errors: ' + errorCount);
        // Otherwise, print a success message....
        grunt.log.writeln('File "' + destination + '" created.');
        filesComplete++;

        if(filesComplete >= fileCount){
          taskDone();
        }
      });
    });
  });

};
