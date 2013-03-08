module.exports = function(grunt) {
  'use strict';
  var dry = require('../lib/dry');

  grunt.registerMultiTask('dry', 'Refactor CSS files into LESS files.', function() {

    grunt.verbose('Processing all files...');

    var done = this.async();
    var fileCount = this.files.length;
    var filesComplete = 0;

    this.files.forEach(function(filePair) {

      var src = filePair.src;
      src.forEach(function(filepath){
        var source = filepath;
        var destination = source.replace(/\.css/, '.less');

        dry.refactor(source, destination, function(errorCount){
          grunt.verbose('Errors: ' + errorCount);
          // Otherwise, print a success message....
          grunt.verbose('File "' + destination + '" created.');
          filesComplete++;

          if(filesComplete >= fileCount){
            done();
          }
        });
      });
    });
  });

};
