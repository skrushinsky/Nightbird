angular.module('app').controller('ArtistController', ($scope, $log, $routeParams, getArtist, fetchLinks, loadImage, IMG_ROOT) => {

    const refreshData = () => {
        getArtist($routeParams.artistId)
        .then(
            artist => {
                $scope.artist = artist;
                loadImage(
                    `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`,
                    '/img/default/artist.jpg')
                .then(src => $scope.artist.image = src);

                fetchLinks(artist, 'genres', 'genres')
                .then(
                    links => $scope.genres = links,
                    notice => $scope.notice = notice
                );
                fetchLinks(artist, 'influences', 'artists')
                .then(
                    links => $scope.influences = links,
                    notice => $scope.notice = notice
                );
                fetchLinks(artist, 'followers', 'artists')
                .then(
                    links => $scope.followers = links,
                    notice => $scope.notice = notice
                );
                fetchLinks(artist, 'contemporaries', 'artists')
                .then(
                    links => $scope.contemporaries = links,
                    notice => $scope.notice = notice
                );
                fetchLinks(artist, 'relatedProjects', 'artists')
                .then(
                    links => $scope.related = links,
                    notice => $scope.notice = notice
                );
                fetchLinks(artist, 'stations', 'stations')
                .then(
                    links => $scope.stations = links,
                    notice => $scope.notice = notice
                );
            }, notice => $scope.notice = notice
        );
    };

    refreshData();
});
