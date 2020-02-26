/* Controllers */

angular.module('app').controller('GenreController', ($scope, $log, $route, $routeParams, $location, fetchPath, fetchUrl, getGenre, IMG_ROOT) => {
    const genreId = $routeParams.genreId;
    $scope.artists = [];

    const fetchSubgenres = genre => {
        if (genre.links['childGenres']) {
            fetchUrl(genre.links.childGenres.href)
            .then(data => {
                genre.subgenres = data.genres;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            });
        }
    };

    const fetchArtists = genre => {
        fetchPath(`/genres/${genre.id}/artists/top`)
        .then(
            data => {
                $scope.artists = data.artists.map( artist => {
                    $log.debug('Adding slide of artist %s - %s', artist.id, artist.name);
                    artist.image = `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`;
                    artist.callback = () => {
                        $log.debug('Going to %s', `/artists/${artist.id}`);
                        $location.path(`/artists/${artist.id}`);
                    };
                    return artist;
                });
                //console.log("artists: %s ", JSON.stringify($scope.artists));
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    const refreshData = () => {
        getGenre(genreId)
        .then(genre => {
            fetchSubgenres(genre);
            fetchArtists(genre);
            $scope.genre = genre;
            $scope.slidesInterval = 5000;
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
    };
    $scope.model = {name: 'Tabs'};
    refreshData();
});
