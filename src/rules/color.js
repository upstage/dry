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