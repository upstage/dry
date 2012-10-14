
var dry = (function(){

    var parserlib = require('../lib/node-parserlib.js');
    var fs        = require('fs');
    var recess    = require('recess');

    var rules = [];

    var addRule = function(rule){
        rules.push(rule);
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
        });

        parser.addListener("error", function(event){
            errorCount++;
            console.log("Parse error: " + event.message + " (" + event.line + "," + event.col + ")", "error");
        });

        // parser.addListener("startrule", function(event){
        //     message = "";
        //     showMessage = false;

        //     //console.log("Starting rule with " + event.selectors.length + " selector(s)");
        //     message += ("Starting rule with " + event.selectors.length + " selector(s)") + "\n";

        //     for(var i=0,len=event.selectors.length; i<len; i++){
        //         var selector = event.selectors[i];

        //         //console.log("  Selector #" + (i+1) + " (" + selector.line + "," + selector.col + ")");
        //         message += ("  Selector #" + (i+1) + " (" + selector.line + "," + selector.col + ")") + "\n";

        //         for(var j=0,count=selector.parts.length; j<count; j++){
        //             //console.log("    Unit #" + (j+1));
        //             message += ("    Unit #" + (j+1)) + "\n";

        //             if(selector.parts[j] instanceof parserlib.css.SelectorPart){
        //                 //console.log("      Element name: " + selector.parts[j].elementName);
        //                 message += ("      Element name: " + selector.parts[j].elementName) + "\n";

        //                 for(var k=0; k < selector.parts[j].modifiers.length; k++){
        //                     //console.log("        Modifier: " + selector.parts[j].modifiers[k]);
        //                     message += ("        Modifier: " + selector.parts[j].modifiers[k]) + "\n";
        //                 }
        //             } else {
        //                 //console.log("      Combinator: " + selector.parts[j]);
        //                 message += ("      Combinator: " + selector.parts[j]) + "\n";
        //             }
        //         }
        //     }
        // });

        // parser.addListener("endrule", function(event){
        //     //console.log("Ending rule with selectors [" + event.selectors + "]");
        //     message += ("Ending rule with selectors [" + event.selectors + "]") + "\n";

        //     if(showMessage){
        //         console.log(message);
        //     }
        // });

        // parser.addListener("property", function(event) {
        //     //console.log("Property '" + event.property + "' has a value of '" + event.value + "' and " + (event.important ? "is" : "isn't") + " important. (" + event.property.line + "," + event.property.col + ")");
        //     message += ("Property '" + event.property + "' has a value of '" + event.value + "' and " + (event.important ? "is" : "isn't") + " important. (" + event.property.line + "," + event.property.col + ")") + "\n";
        //     if(event.invalid){
        //         //console.log("    Not valid: " + event.invalid.message);
        //         message += ("    Not valid: " + event.invalid.message) + "\n";
        //     }

        //     if(/color/g.test(event.property)) {
        //         if(/\\/g.test(event.value) == false) {
        //             colorMap[event.value] = (colorMap[event.value] || 0) + 1;
        //         }
        //     }

        //     if(/^\-/.test(event.property)){
        //         showMessage = true;
        //     }
        // });

        // initialize each rule
        var ruleCallback = function(eventArgs){
            var tuples = [];
            for (var key in eventArgs.data){
                tuples.push([key, eventArgs.data[key]]);
            }
            tuples.sort(function(a,b){
                a = a[1];
                b = b[1];
                return a < b ? 1 : (a > b ? -1 : 0);
            });

            console.log("Results (" + eventArgs.type + "): ");
            console.log(tuples);
            console.log();
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

            // colorMap.forEach(function(color){
            //     console.log(color + ": " + colorMap[color]);
            // });
            // var tuples = [];

            // for (var key in colorMap) {
            //     tuples.push([key, colorMap[key]]);
            // }

            // tuples.sort(function(a,b){
            //     a = a[1];
            //     b = b[1];
            //     return a < b ? 1 : (a > b ? -1 : 0);
            // });

            // console.log(tuples);

            if(done) {
                done(errorCount);
            }

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
        addRule: addRule
    };
    
}());
