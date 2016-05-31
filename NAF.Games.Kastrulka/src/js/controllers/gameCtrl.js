app.controller("gameCtrl", function ($scope, $location, playersService, teamsService, toursService, rulesService, COMMON) {
    $scope.main = {
        toursService: toursService,
        rulesService: rulesService,
        COMMON: COMMON,

        getCurrentActiveUser: function (){
            var currentTeam = $scope.main.toursService.getCurrentTeam();
            return currentTeam.players[currentTeam.currentPlayer];
        },
        start: function () {
            $scope.main.isRoundRunning = true;
        }
    };

    //var teams = teamsService.get();

    //while(toursService.getRemainingHeroesInCurrentTour().length){
    //
    //}
});