app.controller("playersCtrl", function ($scope, $location, COMMON, playersService) {

    $scope.data = {players: []};

    $scope.main = {
        MINIMAL_PLAYERS_AMOUNT: COMMON.MINIMAL_PLAYERS_AMOUNT,
        add: function () {
            var playersCount = $scope.data.players.length;

            $scope.data.players.push({id: playersCount + 1});
            $scope.data.players.push({id: playersCount + 2});
        },
        next: function () {
            if($scope.main.getNotEmptyPlayers().length != $scope.data.players.length) {
                bootbox.confirm({
                    buttons: COMMON.confirmButtons,
                    message: "Остались незаполненные поля. Вы уверены, что ввели всех участников игры?",
                    callback: function(result) {
                        if(result) {
                            $scope.main.proceed();
                            $scope.$apply();
                        }
                    }
                });
                //$('#warnModal').modal();
            }
            else {
                $scope.main.proceed();
            }
        },
        proceed: function (){
            playersService.set($scope.main.getNotEmptyPlayers());
            $location.path('heroes');
        },
        getNotEmptyPlayers: function (){
            return _.filter($scope.data.players, 'name');
        },
        validate: function(){
            $scope.main.checkIsPlayersMoreThanRequired();
            $scope.main.checkIsPlayersAmountIsEven();
            $scope.main.checkIsAllNameAreUnique();
        },
        checkIsPlayersMoreThanRequired: function () {
            $scope.playersForm.$setValidity("minPlayers", $scope.data && $scope.data.players && $scope.data.players.length &&
                $scope.main.getNotEmptyPlayers().length >= $scope.main.MINIMAL_PLAYERS_AMOUNT);
        },
        checkIsPlayersAmountIsEven: function () {
            if($scope.data && $scope.data.players && $scope.data.players.length){
                $scope.playersForm.$setValidity("evenPlayers", $scope.main.getNotEmptyPlayers().length % 2 == 0);
            }
            else{
                $scope.playersForm.$setValidity("evenPlayers", true);
            }
        },
        checkIsAllNameAreUnique: function (){
            var notEmptyPlayers = $scope.main.getNotEmptyPlayers();
            $scope.playersForm.$setValidity("uniquePlayers", _.uniqBy(notEmptyPlayers, 'name').length == notEmptyPlayers.length);
        }
    };

    (function () {

        var players = playersService.get();

        if(players && players.length){
            $scope.data.players = players;
        }
        else {
            for (var i = 0; i < $scope.main.MINIMAL_PLAYERS_AMOUNT; i++) {
                $scope.data.players.push({id: i + 1});
            }
        }

        $scope.$watchCollection(function () {
            return $scope.data.players;
        }, function () {
            $scope.main.checkIsPlayersMoreThanRequired();
        });
    })();
});