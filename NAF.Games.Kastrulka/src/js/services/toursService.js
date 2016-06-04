app.factory('toursService', function(heroesService, teamsService, COMMON){

    var tours = [];

    var incrementTour = function (){
        tours.push({
            number: tours.length + 1,
            remainingHeroes: _.shuffle(heroesService.get()),
            guessedHeroes: [],
            teams: teamsService.getTeamsExtendedForGame({currentPlayer: 0}),
            currentTeamNumber: 0,
            remainingTimeInRound: COMMON.ROUND_PERIOD
        });
    };

    var getCurrentTour = function (){
        return tours[tours.length - 1];
    };

    var getCurrentTourProperty = function (propertyName){
        return getCurrentTour()[propertyName];
    };

    var getCurrentTeam = function(){
        var currentTour = getCurrentTour();
        return currentTour.teams[currentTour.currentTeamNumber];
    };

    var incrementCurrentUser = function(){
        var currentTeam = getCurrentTeam();
        currentTeam.currentPlayer++;
    };

    var getRemainingHeroesInCurrentTour = function (){
        return getCurrentTourProperty("remainingHeroes");
    };

    var getGuessedHeroesInCurrentTour = function () {
        return getCurrentTourProperty("guessedHeroes");
    };

    return {
        incrementTour: incrementTour,
        getCurrentTourNumber: function () {
            return getCurrentTourProperty("number");
        },
        initialize: function (){
            tours = [];
            incrementTour();
        },
        getRemainingHeroesInCurrentTour: getRemainingHeroesInCurrentTour,
        getGuessedHeroesInCurrentTour: getGuessedHeroesInCurrentTour,
        getCurrentTeam: getCurrentTeam,
        getCurrentActiveUser: function (){
            var currentTeam = getCurrentTeam();
            return currentTeam.players[currentTeam.currentPlayer % currentTeam.players.length];
        },
        getCurrentPassiveUser: function (){
            var currentTeam = getCurrentTeam();
            return currentTeam.players[(currentTeam.currentPlayer + 1) % currentTeam.players.length];
        },
        getRemainingTimeInRound: function (){
            return getCurrentTour().remainingTimeInRound/1000;
        },
        decrementRemainingTimeInRound: function(decrementValue){
            var currentTour = getCurrentTour();
            currentTour.remainingTimeInRound = currentTour.remainingTimeInRound - decrementValue;
        },
        moveHeroFromRemainingToGuessed: function (){
            var currentTour = getCurrentTour();
            currentTour.guessedHeroes.push(currentTour.remainingHeroes[0]);
            currentTour.remainingHeroes.splice(0,1);

            if(!getRemainingHeroesInCurrentTour().length){
                incrementTour();
            }
        },
        getCurrentHeroName: function (){
            var currentTour = getCurrentTour();
            if(currentTour.remainingHeroes && currentTour.remainingHeroes.length && currentTour.remainingHeroes[0].name){
                return currentTour.remainingHeroes[0].name;
            }
        },
        incrementRound: function (){
            var currentTour = getCurrentTour();
            currentTour.currentTeamNumber = (currentTour.currentTeamNumber + 1) % currentTour.teams.length;
            currentTour.remainingTimeInRound = COMMON.ROUND_PERIOD;
            currentTour.remainingHeroes = _.shuffle(currentTour.remainingHeroes);
            incrementCurrentUser();
        }
    };
});