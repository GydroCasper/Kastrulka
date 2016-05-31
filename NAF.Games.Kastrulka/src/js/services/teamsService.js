app.factory('teamsService', function(){
    var teams = [];

    var get = function (){
        return angular.copy(teams);
    };

    return {
        set: function(source){
            teams = source;
        },
        get: get,
        getTeamsExtendedForGame: function (obj){
            var target = get();
            _.forEach(target, function (team){
                _.assign(team, obj);
            });

            return target;
        }
    };

});