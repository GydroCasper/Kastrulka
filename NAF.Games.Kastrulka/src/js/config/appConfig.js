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
        })
        .when('/results', {
            templateUrl: './src/html/results.html',
            controller: 'resultsCtrl'
        })
        .run(function($rootScope, $location) {
            $rootScope.$on("$routeChangeStart", function (event, next) {
                if (!(next.templateUrl == "views/login.html")) {
                    $location.path("/login");
                }
            })
        });
});