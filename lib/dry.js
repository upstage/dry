/*
 * dry
 * https://github.com/sellside/dry
 *
 * Copyright (c) 2012 Brian Woodward
 * Licensed under the MIT license.
 */

module.exports = (function() {

    var parserlib = require('./node-parserlib.js');
    var fs        = require('fs');

    var refactor = function(source, destination, done){
        destination = destination || appendExtension(getFilename(source), "less");

        console.log(source);
        console.log(destination);

        // read in the css document
        var sourceText = fs.readFileSync(source, 'utf8');

        // get a new parser
        var parser = new parserlib.css.Parser({
            starHack: true,
            underscoreHack: true,
            ieFilters: true
        });

        // set up the tree
        var ast = {};
        var errorCount = 0;

        // set up all the events
        parser.addListener("startstylesheet", function() {
            console.log("Starting to parse style sheet");
        });

        parser.addListener("endstylesheet", function(){
            console.log("Finished parsing style sheet");
        });

        parser.addListener("error", function(event){
            errorCount++;
            console.log("Parse error: " + event.message + " (" + event.line + "," + event.col + ")", "error");
        });

        // run parser
        parser.parse(sourceText);

        if(done) {
            done(errorCount);
        }

    };

    var getFilename = function(filePath){
        // return just the filename without the directory structure
        // or extension
        return filePath;
    };

    var appendExtension = function(filename, extension){
        // return the given filename with the proper extension
        return filename + "." + extension; // add more logic to this
    };


    var awesome = function() {
      return 'awesome';
    };


    return {
        awesome: awesome,
        refactor: refactor
    };
    
}());
