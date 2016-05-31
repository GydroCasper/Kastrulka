app.factory('rulesService', function(COMMON){
    var tourRules = [
        'В данном туре игры один участник команды объясняет персонажа, не используя при этом созвучных и однокоренных слов. ' +
            'Второй участник игры должен угадать персонажа. Раунд длится ' + COMMON.ROUND_PERIOD +
        ' секунд, за которые нужно угадать как можно больше персонажей.'
    ];

    return {
        get: function(tourNumber){
            return tourRules[tourNumber];
        }
    };
});