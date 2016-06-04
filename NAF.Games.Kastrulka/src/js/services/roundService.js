app.factory('roundService', function(){
    var isRoundRunning;

    return {
        start: function (){
            isRoundRunning = true;
        },
        finish: function(){
            isRoundRunning = false;
        },
        get: function (){
            return isRoundRunning;
        }
    };
});