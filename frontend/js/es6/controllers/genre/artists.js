/* Controllers */

angular.module('app').controller('GenreArtistsController', ($scope, $log, $route, $routeParams, $location, fetchPath, loadImage, getGenre, nameComparator, IMG_ROOT) => {
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
                                    loadImage(
                                        `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`,
                                        '/img/default/artist.jpg')
                                    .then(src => artist.image = src);
                                    artist.callback = () => $location.path(`/artists/${artist.id}`);
                                    return artist;
                                }).sort(nameComparator);
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
