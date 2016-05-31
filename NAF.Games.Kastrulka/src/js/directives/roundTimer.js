app.directive('roundTimer', ['toursService', function (toursService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "./src/html/round.html",
        scope: {},
        controller: function ($scope){
            $scope.main = {
                toursService: toursService
            };
        }
    };
}]);