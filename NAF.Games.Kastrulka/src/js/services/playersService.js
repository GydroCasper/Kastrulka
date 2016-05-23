app.factory('playersService', function(){

    var players = [];

    return {
        set: function(humans){
            players = humans;
        },
        get: function(){
            return angular.copy(players);
        }
    };
});