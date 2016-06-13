app.controller("resultsCtrl", function ($scope, teamsService, toursService) {
    $scope.data = {teams: teamsService.get()};
    _.forEach($scope.data.teams, function (team){
        _.assign(team, {guessedHeroes: toursService.getGuessedHeroesCountByTeam(team)});
    });

    $scope.data.teams = _.orderBy($scope.data.teams, 'guessedHeroes', 'desc');
});