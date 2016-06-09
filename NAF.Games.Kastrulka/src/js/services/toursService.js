app.factory('toursService', function ($location, heroesService, teamsService, roundService, COMMON) {

    var tours = [];

    var incrementTour = function () {
        if(tours && tours.length == COMMON.TOURS_NUMBERS){
            $location.path('results');
        }

        var isFirstTour = !tours || !tours.length;
        var currentTour = getCurrentTour();
        var isTimeRemainsYet = !isFirstTour && currentTour.remainingTimeInRound >= COMMON.TRANSITION_TIME_LIMIT;
        var remainingTimeInRound = isTimeRemainsYet ? currentTour.remainingTimeInRound : COMMON.ROUND_PERIOD;

        tours.push({
            number: tours.length + 1,
            remainingHeroes: _.shuffle(heroesService.get()),
            guessedHeroes: [],
            teams: !isFirstTour && currentTour && currentTour.teams
                ? angular.copy(currentTour.teams)
                : teamsService.getTeamsExtendedForGame({currentPlayer: 0}),
            currentTeamNumber: !isFirstTour && currentTour ? currentTour.currentTeamNumber : 0,
            remainingTimeInRound: remainingTimeInRound
        });

        roundService.finish();

        if(!isTimeRemainsYet){
            incrementRound();
        }
    };

    var incrementRound = function (){
        var currentTour = getCurrentTour();
        currentTour.currentTeamNumber = (currentTour.currentTeamNumber + 1) % currentTour.teams.length;
        currentTour.remainingTimeInRound = COMMON.ROUND_PERIOD;
        currentTour.remainingHeroes = _.shuffle(currentTour.remainingHeroes);
        incrementCurrentUser();
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
        }
    };
});