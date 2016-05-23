app.factory('numbersService', function () {
    return {
        isInt: function (n) {
            return Number(n) === n && n % 1 === 0;
        }
    };
});