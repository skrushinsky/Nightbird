/* Controllers */

angular.module('app').controller('GenreController', ($scope, $log, $route, $routeParams, getGenre) => {
    const genreId = $routeParams.genreId;

    const refreshData = () => {
        getGenre(genreId)
            .then(genre => {
                $scope.genre = genre;
                $scope.slidesInterval = 5000;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            });
    };
    refreshData();
});
