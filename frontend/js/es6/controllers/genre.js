
angular.module('app').controller('GenreController', ($scope, $log, $route, $routeParams, getGenre, fetchLinks) => {
    getGenre($routeParams.genreId)
        .then(genre => {
            $scope.genre = genre;
            fetchLinks(genre, 'childGenres', 'genres')
            .then(
                links => $scope.children = links,
                notice => $scope.notice = notice
            );
            fetchLinks(genre, 'parentGenres', 'genres')
            .then(
                links => $scope.parents = links.filter( l => {
                    const name = l.name.toLowerCase();
                    return name !== 'music' && name !== 'all music';
                }),
                notice => $scope.notice = notice
            );
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
});
