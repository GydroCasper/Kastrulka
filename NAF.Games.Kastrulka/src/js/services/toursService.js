app.factory('toursService', function ($location, heroesService, teamsService, roundService, COMMON) {

    var tours = [];

    var incrementTour = function () {
        if(tours && tours.length >= COMMON.TOURS_NUMBERS){
            $location.path('results');
        }

        var isFirstTour = !tours || !tours.length;
        var currentTour = getCurrentTour();
        var isTimeRemainsYet = !isFirstTour && currentTour.remainingTimeInRound >= COMMON.TRANSITION_TIME_LIMIT;
        var remainingTimeInRound = isTimeRemainsYet ? currentTour.remainingTimeInRound : COMMON.ROUND_PERIOD;
        var teams = teamsService.get();

        _.forEach(teams, function (team){
            var currentPlayerObj = {
                currentPlayer: isFirstTour ? 0 : _.find(currentTour.teams, function(item) { return item.id === team.id; }).currentPlayer
            };

            _.assign(team, currentPlayerObj);
        });

        var tour = {
            number: tours.length + 1,
            remainingHeroes: _.shuffle(heroesService.get()),
            guessedHeroes: [],
            remainingTimeInRound: remainingTimeInRound,
            teams: teams,
            currentTeamNumber: isFirstTour ? 0 : currentTour.currentTeamNumber
        };

        tours.push(tour);

        if(!isFirstTour && !isTimeRemainsYet){
            incrementRound();
        }

        roundService.finish();
    };

    var incrementRound = function (){
        var currentTour = getCurrentTour();
        incrementCurrentUser();
        currentTour.currentTeamNumber = (currentTour.currentTeamNumber + 1) % currentTour.teams.length;
        currentTour.remainingTimeInRound = COMMON.ROUND_PERIOD;
        currentTour.remainingHeroes = _.shuffle(currentTour.remainingHeroes);
    };

    var getCurrentTour = function () {
        return tours && tours.length ? _.last(tours) : null;
    };

    var getCurrentTourProperty = function (propertyName) {
        return getCurrentTour()[propertyName];
    };

    var getCurrentTeam = function () {
        var currentTour = getCurrentTour();
        return currentTour.teams[currentTour.currentTeamNumber];
    };

    var incrementCurrentUser = function () {
        var currentTeam = getCurrentTeam();
        currentTeam.currentPlayer++;
    };

    var getRemainingHeroesInCurrentTour = function () {
        return getCurrentTourProperty("remainingHeroes");
    };

    var getGuessedHeroesInCurrentTour = function () {
        return getCurrentTourProperty("guessedHeroes");
    };

    var getCurrentActiveUser = function (){
        var currentTeam = getCurrentTeam();
        return currentTeam.players[currentTeam.currentPlayer % currentTeam.players.length];
    };

    var getCurrentPassiveUser = function (){
        var currentTeam = getCurrentTeam();
        return currentTeam.players[(currentTeam.currentPlayer + 1) % currentTeam.players.length];
    };

    var getGuessedHeroesCountByTeam = function (team){
        var count = 0;
        _.forEach(tours, function(tour) {
            var tourTeam = _.find(tour.teams, function(item) { return item.id == team.id; });
            if(tourTeam) {
                _.forEach(tourTeam.players, function(player) {
                    if(player.guessedHeroes){
                        count += player.guessedHeroes.length;
                    }
                });
            }
        });

        return count;
    };

    return {
        incrementTour: incrementTour,
        getCurrentTourNumber: function () {
            return getCurrentTourProperty("number");
        },
        initialize: function () {
            tours = [];
            incrementTour();
        },
        getRemainingHeroesInCurrentTour: getRemainingHeroesInCurrentTour,
        getGuessedHeroesInCurrentTour: getGuessedHeroesInCurrentTour,
        getCurrentTeam: getCurrentTeam,
        getCurrentActiveUser: getCurrentActiveUser,
        getCurrentPassiveUser: getCurrentPassiveUser,
        getRemainingTimeInRound: function () {
            return getCurrentTour().remainingTimeInRound / 1000;
        },
        decrementRemainingTimeInRound: function (decrementValue) {
            var currentTour = getCurrentTour();
            currentTour.remainingTimeInRound = currentTour.remainingTimeInRound - decrementValue;
        },
        moveHeroFromRemainingToGuessed: function () {
            var currentTour = getCurrentTour();
            currentTour.guessedHeroes.push(currentTour.remainingHeroes[0]);
            currentTour.remainingHeroes.splice(0, 1);

            if (!getRemainingHeroesInCurrentTour().length) {
                incrementTour();
            }
        },
        getCurrentHeroName: function () {
            var currentTour = getCurrentTour();
            if (currentTour.remainingHeroes && currentTour.remainingHeroes.length && currentTour.remainingHeroes[0].name) {
                return currentTour.remainingHeroes[0].name;
            }
        },
        incrementRound: incrementRound,
        addGuessedHeroToPlayerCollection: function (){
            var currentPassivePlayer = getCurrentPassiveUser();

            if(!angular.isDefined(currentPassivePlayer.guessedHeroes)){
                currentPassivePlayer.guessedHeroes = [];
            }

            var currentTour = getCurrentTour();
            currentPassivePlayer.guessedHeroes.push(_.last(currentTour.guessedHeroes));
        },
        getGuessedHeroesCountByTeam: getGuessedHeroesCountByTeam
    };
});