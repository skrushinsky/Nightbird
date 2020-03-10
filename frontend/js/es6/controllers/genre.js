
angular.module('app').controller('GenreController', ($scope, $log, $route, $routeParams, getGenre) => {
    getGenre($routeParams.genreId)
        .then(genre => {
            $scope.genre = genre;
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
});
