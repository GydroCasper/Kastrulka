app.factory('teamsService', function(){

    var teams = [];

    return {
        set: function(source){
            teams = source;
        },
        get: function(){
            return angular.copy(teams);
        }
    };

});