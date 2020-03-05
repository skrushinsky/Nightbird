/* Controllers */

angular.module('app').controller('SubGenresController', ($scope, $log, $routeParams, $location, fetchUrl, getGenre) => {

    const refreshData = () => {
        getGenre($routeParams.genreId)
            .then(genre => {
                $scope.genre = genre;
                $scope.gotoGenre = id => $location.path(`/genres/${id}`);
                if (genre.links['childGenres']) {
                    fetchUrl(genre.links.childGenres.href)
                        .then(data => {
                            $scope.genres = data.genres
                                .filter(a => 'id' in a)
                                .map(g => {
                                    g.image = '/img/genres/14-pop.svg';
                                    return g;
                                });
                        }, notice => {
                            $log.warn('Got notice: %s', notice);
                            $scope.notice = notice;
                        });
                }
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            });
    };
    refreshData();
});
