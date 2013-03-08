
var dry = (function(){

    var parserlib = require('./node-parserlib.js');
    //var fs        = require('fs');
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
        //var ast = {};
        //var message = "";
        //var showMessage = false;
        var errorCount = 0;
        //var fontSizeMap = [];
        //var colorMap = [];

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
