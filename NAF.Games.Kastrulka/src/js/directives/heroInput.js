app.directive('heroInput', function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "./src/html/heroInput.html",
        scope: {
            hero: "=",
            heroNameChanged: "&"
        },
        controller: function ($scope){
            $scope.$watch('hero.name', function (){
                $scope.heroNameChanged()();
            });
        }
    };
});