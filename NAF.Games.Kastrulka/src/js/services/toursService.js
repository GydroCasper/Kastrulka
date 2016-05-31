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

    return {
        incrementTour: incrementTour,
        getCurrentTourNumber: function () {
            return getCurrentTourProperty("number");
        },
        initialize: function (){
            tours = [];
            incrementTour();
        },
        getRemainingHeroesInCurrentTour: function (){
            return getCurrentTourProperty("remainingHeroes");
        },
        getGuessedHeroesInCurrentTour: function (){
            return getCurrentTourProperty("guessedHeroes");
        },
        getCurrentTeam: getCurrentTeam,
        getCurrentActiveUser: function (){
            var currentTeam = getCurrentTeam();
            return currentTeam.players[currentTeam.currentPlayer];
        },
        getCurrentPassiveUser: function (){
            var currentTeam = getCurrentTeam();
            return currentTeam.players[(currentTeam.currentPlayer + 1) % currentTeam.players.length];

        },
        getRemainingTimeInRound: function (){
            return getCurrentTour().remainingTimeInRound;
        }
    };

});