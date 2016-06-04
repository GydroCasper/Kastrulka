app.directive('roundTimer', ['toursService', 'roundService', function (toursService, roundService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "./src/html/round.html",
        scope: {
            //isRoundRunning: "="
        },
        controller: function ($scope, $interval, COMMON){
            $scope.main = {
                toursService: toursService,
                roundService: roundService,
                timer: null,
                startTimer: function (callback){
                    $scope.main.timer = $interval(function (){
                        callback();
                    }, COMMON.TIMER_STEP_VALUE);
                },
                guessed: function (){
                    toursService.moveHeroFromRemainingToGuessed();
                }
            };

            var timerStepProcess = function(){
                toursService.decrementRemainingTimeInRound(COMMON.TIMER_STEP_VALUE);
                if(toursService.getRemainingTimeInRound() <= 0){
                    $interval.cancel($scope.main.timer);
                    roundService.finish();
                    toursService.incrementRound();
                }
            };

            $scope.$watch('main.roundService.get()', function (newValue){
                if(newValue) {
                    $scope.main.startTimer(timerStepProcess);
                }
                else if(angular.isDefined(newValue) && !newValue){
                    $interval.cancel($scope.main.timer);
                }
            });
        }
    };
}]);