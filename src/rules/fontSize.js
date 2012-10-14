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