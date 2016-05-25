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