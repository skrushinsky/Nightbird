/* Controllers */

angular.module('app').controller('GenreTracksController', ($scope, $log, $route, $routeParams, $location, fetchPath, fetchUrl, getGenre, fetchTracks) => {
    const genreId = $routeParams.genreId;
    $scope.tracks = [];

    const refreshData = () => {
        getGenre(genreId)
            .then(genre => {
                $scope.genre = genre;
                fetchTracks(`/genres/${genre.id}/tracks/top`)
                    .then(
                        tracks => {
                            $scope.tracks = tracks;
                            $scope.gotoGenre = id => $location.path(`/genres/${id}`);
                        }, notice => {
                            $log.warn('Got notice: %s', notice);
                            $scope.notice = notice;
                        }
                    );
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            });
    };
    refreshData();
});
