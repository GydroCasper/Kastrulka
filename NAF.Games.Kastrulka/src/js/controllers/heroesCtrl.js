app.controller("heroesCtrl", function ($scope, $location, COMMON, playersService, heroesService, numbersService) {
    $scope.data = {
        players: playersService.get(),
        heroesAmountBeforeValidation: COMMON.HEROES_DEFAULT_AMOUNT
    };

    $scope.main = {
        getFilledHeroesForPlayer: function (player){
            return heroesService.getFilledHeroesAmountForPlayer(player);
        },
        heroNameChanged: function (player){
            $scope.main.validateHeroesAmountForAllPlayers();
            $scope.main.validateHeroesUniquity();
        },
        validateHeroesAmountForAllPlayers: function (){
            if($scope.heroesForm) {
                $scope.heroesForm.$setValidity("heroesAmountNotEqualsToRequired", !checkIfHeroesAmountNotEqualsToRequired());
            }
        },
        validateHeroesUniquity: function (player){
            if($scope.heroesForm) {
                $scope.heroesForm.$setValidity("heroIsNotUnique", heroesService.checkIfHeroesAreUnique($scope.data.players));
            }
        },
        next: function(){
            playersService.set($scope.data.players);
            heroesService.set(_.flatMap($scope.data.players, 'heroes'));
            $location.path('teams');
        }
    };

    var extendHeroes = function (player){
        while (player.heroes.length < $scope.data.heroesAmount) {
            player.heroes.push({});
        }
    };

    var shrinkHeroes = function (player){
        while ($scope.data.heroesAmount < player.heroes.length) {
            var lastIndexOfEmptyHero = heroesService.getLastIndexOfEmptyHero(player.heroes);
            if (lastIndexOfEmptyHero >= 0) {
                player.heroes.splice(lastIndexOfEmptyHero, 1);
            }
            else{
                player.heroes.pop();
            }
        }
    };

    var refreshHeroes = function () {
        $scope.data.heroesAmount = $scope.data.heroesAmountBeforeValidation;

        _.each($scope.data.players, function (player) {
            player.heroes = player.heroes || [];

            if (player.heroes.length != $scope.data.heroesAmount) {
                extendHeroes(player);
                shrinkHeroes(player);
            }
        });
    };

    (function init (){
        refreshHeroes();
    })();

    var checkIfRemovingHeroesNeeded = function(){
        return _.some($scope.data.players, function(player){
            return heroesService.getFilledHeroesAmountForPlayer(player) > $scope.data.heroesAmountBeforeValidation;
        })
    };

    var checkIfHeroesAmountNotEqualsToRequired = function(){
        return _.some($scope.data.players, function(player){
            return heroesService.getFilledHeroesAmountForPlayer(player) != $scope.data.heroesAmount;
        })
    };

    $scope.$watch('data.heroesAmountBeforeValidation', function (newValue) {
        if(!numbersService.isInt(newValue)){
            $scope.data.heroesAmountBeforeValidation = $scope.data.heroesAmount;
            return;
        }

        var num = parseInt(newValue);

        if(num < 1){
            $scope.data.heroesAmountBeforeValidation = $scope.data.heroesAmount;
            return;
        }

        var isRemovingHeroesNeeded = checkIfRemovingHeroesNeeded();

        if(!isRemovingHeroesNeeded){
            refreshHeroes();
            return;
        }

        var deletingHeroesConfirmed = function (result){
            if (result) {
                refreshHeroes();
            }
            else {
                $scope.data.heroesAmountBeforeValidation = $scope.data.heroesAmount;
            }

            $scope.$apply();
        };

        bootbox.confirm({
            buttons: COMMON.confirmButtons,
            message: "Данное действие приведет к удалению некоторых уже введенных персонажей. Продолжить?",
            callback: deletingHeroesConfirmed
        });
    });

    $scope.$watchGroup(['heroesForm', 'data.heroesAmount'], function (){
        $scope.main.validateHeroesAmountForAllPlayers();
    });
});