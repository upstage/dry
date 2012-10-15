/*
 * dry
 * https://github.com/sellside/dry
 *
 * Copyright (c) 2012 Brian Woodward
 * Licensed under the MIT license.
 */

module.exports = (function() {
  

var dry = (function(){

    var parserlib = require('../lib/node-parserlib.js');
    var fs        = require('fs');
    var recess    = require('recess');

    var rules = [];
    var refactors = [];
    var results = [];

    var addRule = function(rule){
        rules.push(rule);
    };

    var addRefactor = function(refactor){
        rules.push(refactor);
    };

    var refactor = function(source, destination, done){
        destination = destination || appendExtension(getFilename(source), "less");

        console.log(source);
        console.log(destination);

        // read in the css document
        //var sourceText = fs.readFileSync(source, 'utf8');

        // get a new parser
        var parser = new parserlib.css.Parser({
            starHack: true,
            underscoreHack: true,
            ieFilters: true
        });

        // set up the tree
        var ast = {};
        var message = "";
        var showMessage = false;
        var errorCount = 0;
        var fontSizeMap = [];
        var colorMap = [];

        // set up all the events
        parser.addListener("startstylesheet", function() {
            console.log("Starting to parse style sheet");
        });

        parser.addListener("endstylesheet", function(){
            console.log("Finished parsing style sheet");

            for (var i=0; i < refactors.length; i++){
                var refact = refactors[i];
                refact.init(results);
            }

            if(done) {
                done(errorCount);
            }
        });

        parser.addListener("error", function(event){
            errorCount++;
            console.log("Parse error: " + event.message + " (" + event.line + "," + event.col + ")", "error");
        });

        // initialize each rule
        var ruleCallback = function(eventArgs){
            results.push(eventArgs);
        };

        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            rule.init(parser, ruleCallback);
        }

        var options = { compile: true };
        recess( source, options, function( err, data ) {

            console.log("here");
//            console.log(data.output[0]);
            if(err) {
                console.log("error: " + err);
            }

            // run parser
            parser.parse(data.output[0]);
        });

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
        refactor: refactor,
        addRule: addRule,
        addRefactor: addRefactor
    };
    
}());

dry.addRule((function(){

  var init = function(parser, callback) {

    var colorMap = [];

    parser.addListener("property", function(event){

      if(/color/g.test(event.property)) {
        if(/\\/g.test(event.value) === false) {
          colorMap[event.value] = (colorMap[event.value] || 0) + 1;
        }
      }
      
    });

    parser.addListener("endstylesheet", function(){
      if(callback){
        callback({
          type: 'colors',
          data: colorMap
        });
      }
    });
  };

  return {
    init: init
  };

}()));
dry.addRule((function(){

  var init = function(parser, callback) {

    var fontSizeMap = [];

    parser.addListener("property", function(event){
      if(/font\-size/.test(event.property)){
        fontSizeMap[event.value] = (fontSizeMap[event.value] || 0) + 1;
      }
    });

    parser.addListener("endstylesheet", function(){
      if(callback){
        callback({
          type: 'fontSizes',
          data: fontSizeMap
        });
      }
    });
  };

  return {
    init: init
  };

}()));

dry.addRefactor((function(){

    var init = function(data) {

        console.log('here - color');
        var sort = function(a,b){
            a = a[1];
            b = b[1];
            return a < b ? 1 : (a > b ? -1 : 0);
        };

        for (var i; i < data.length; i++) {
            var result = data[i];
            if(/colors/.test(result.type)) {
                var tuples = [];
                for (var key in result.data){
                    tuples.push([key, result.data[key]]);
                }
                tuples.sort(sort);

                console.log("Results (" + result.type + "): ");
                console.log(tuples);
                console.log();
            }
        }

    };

    return {
        init: init
    };

}()));


dry.addRefactor((function(){

    var init = function(data) {

        console.log('here - fontSize');
        var sort = function(a,b){
            a = a[1];
            b = b[1];
            return a < b ? 1 : (a > b ? -1 : 0);
        };

        for (var i; i < data.length; i++) {
            var result = data[i];
            if(/fontSizes/.test(result.type)) {
                var tuples = [];
                for (var key in result.data){
                    tuples.push([key, result.data[key]]);
                }
                tuples.sort(sort);

                console.log("Results (" + result.type + "): ");
                console.log(tuples);
                console.log();
            }
        }
    };

    return {
        init: init
    };

}()));


  return dry;

}());
