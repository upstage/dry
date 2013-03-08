
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
