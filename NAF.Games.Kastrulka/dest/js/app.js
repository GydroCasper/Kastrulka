var app = angular.module("kastrulkaApp", ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './src/html/startpage.html',
            controller  : 'startpageCtrl'
        })
        .when('/players', {
            templateUrl : './src/html/players.html',
            controller  : 'playersCtrl'
        })
        .when('/heroes', {
            templateUrl : './src/html/heroes.html',
            controller  : 'heroesCtrl'
        })
        .when('/teams', {
            templateUrl: './src/html/teams.html',
            controller: 'teamsCtrl'
        })
        .when('/game', {
            templateUrl: './src/html/game.html',
            controller: 'gameCtrl'
        });
});
app.constant('COMMON', {
    MINIMAL_PLAYERS_AMOUNT: 4,
    HEROES_DEFAULT_AMOUNT: 3,
    confirmButtons: {
        confirm: {
            label: 'Да'
        },
        cancel: {
            label: 'Нет'
        }
    }
});
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
/**
 * Created by gydro_000 on 5/16/2016.
 */
app.controller("kastrulkaCtrl", function($scope) {
});
app.controller("gameCtrl", function ($scope, $location, playersService, teamsService, toursService) {
    $scope.main = {
        toursService: toursService
    };

    var teams = teamsService.get();

    //while()
});
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
/**
 * Created by gydro_000 on 5/17/2016.
 */
app.controller("startpageCtrl", function($scope) {
});
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
app.factory('heroesService', function () {
    var heroes = [];

    return {
        set: function (source){
            heroes = source;
        },
        get: function(){
            return angular.copy(heroes);
        },
        checkIfHeroesAreUnique: function (players) {
            return !_.some(players, function (player){
                var notEmptyHeroes = _.filter(player.heroes, 'name');
                return _.uniqBy(notEmptyHeroes, 'name').length != notEmptyHeroes.length;
            });
        },
        getLastIndexOfEmptyHero: function (heroes){
            return _.findLastIndex(heroes, function (hero) {
                return !hero || !hero.name || !hero.name.length;
            });
        },
        getFilledHeroesAmountForPlayer: function (player){
            return _.filter(player.heroes, 'name').length;
        }
    };
});
app.factory('numbersService', function () {
    return {
        isInt: function (n) {
            return Number(n) === n && n % 1 === 0;
        }
    };
});
app.factory('playersService', function(){

    var players = [];

    return {
        set: function(humans){
            players = humans;
        },
        get: function(){
            return angular.copy(players);
        }
    };
});
app.factory('teamsService', function(){

    var teams = [];

    return {
        set: function(source){
            teams = source;
        },
        get: function(){
            return angular.copy(teams);
        }
    };

});
app.factory('toursService', function(heroesService){

    var tours = [];

    var incrementTour = function (){
        tours.push({number: tours.length + 1, heroes: _.shuffle(heroesService.get()), guessedHeroes: []});
    };

    return {
        incrementTour: incrementTour,
        getCurrentTourNumber: function () {
            return tours[tours.length - 1].number;
        },
        initialize: function (){
            tours = [];
            incrementTour();
        }//,
        //getRemaingHeroesCount function (){
        //
        //}
    };

});