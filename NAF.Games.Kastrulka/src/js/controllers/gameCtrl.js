app.controller("gameCtrl", function ($scope, $location, playersService, teamsService, toursService, rulesService, roundService, COMMON) {
    $scope.main = {
        toursService: toursService,
        rulesService: rulesService,
        COMMON: COMMON,
        roundService: roundService,

        getCurrentActiveUser: function (){
            var currentTeam = $scope.main.toursService.getCurrentTeam();
            return currentTeam.players[currentTeam.currentPlayer];
        },
        start: function () {
            roundService.start();
            //$scope.main.isRoundRunning = true;
        }//,
        //finish: function (){
        //    $scope.main.isRoundRunning = false;
        //    debugger;
        //}
    };
});