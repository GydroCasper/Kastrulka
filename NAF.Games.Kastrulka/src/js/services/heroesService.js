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