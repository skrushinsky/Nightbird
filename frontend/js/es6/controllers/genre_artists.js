/* Controllers */

angular.module('app').controller('GenreArtistsController', ($scope, $log, $route, $routeParams, $location, fetchPath, getGenre, IMG_ROOT) => {
    const genreId = $routeParams.genreId;
    $scope.artists = [];

    const refreshData = () => {
        getGenre(genreId)
            .then(genre => {
                $scope.genre = genre;
                $scope.gotoGenre = id => $location.path(`/genres/${id}`);
                fetchPath(`/genres/${genre.id}/artists/top`)
                    .then(
                        data => {
                            $scope.artists = data.artists.filter(a => 'id' in a)
                                .map(artist => {
                                    artist.image = `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`;
                                    artist.callback = () => $location.path(`/artists/${artist.id}`);
                                    return artist;
                                });
                            if ($scope.artists.length) {
                                $scope.activeSlide = $scope.artists[0].id;
                            }
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
