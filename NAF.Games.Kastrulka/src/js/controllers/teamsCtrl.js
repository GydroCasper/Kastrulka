app.controller("teamsCtrl", function ($scope, $location, playersService, teamsService, toursService) {

    $scope.main = {
        shuffle: function (){
            createTeams();
        },
        next: function(){
            teamsService.set($scope.data.teams);
            toursService.initialize();
            $location.path('game');
        }
    };

    $scope.data = { teams: []};

    var createTeams = function (){
        $scope.data.teams = [];
        var players = _.shuffle(playersService.get());

        for(var i=0;i<players.length;i+=2){
            var num = i/2 + 1;
            $scope.data.teams.push({players: [players[i], players[i+1]], id: num, name: 'Команда ' + num});
        }
    };

    createTeams();
});