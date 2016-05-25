app.controller("gameCtrl", function ($scope, $location, playersService, teamsService, toursService) {
    $scope.main = {
        toursService: toursService
    };

    var teams = teamsService.get();

    //while()
});