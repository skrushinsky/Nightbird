angular.module('app').controller('ArtistController', ($scope, $log, $routeParams, $location, getArtist, fetchUrl, loadImage, shuffleArray, IMG_ROOT) => {

    const linkColors = ['label-info', 'label-default', 'label-primary', 'label-warning', 'label-danger'];


    const fetchLinks = (artist, key, section) => {
        if (key in artist.links) {
            fetchUrl(artist.links[key].href)
            .then(
                data => {
                    const colors = shuffleArray(linkColors);
                    //$log.debug('Shuffled colors: %s', JSON.stringify(colors));
                    const l = colors.length;
                    $scope[key] = data[section].map( (item, i) => {
                        return {
                            id: item.id,
                            name: item.name,
                            callback: () => $location.path(`/${section}/${item.id}`),
                            colorClass: colors[ i % l ]
                        }
                    });
                    //$log.debug('$scope.%s = %s', key, JSON.stringify($scope[key]));
                }, notice => {
                    $log.warn('Got notice: %s', notice);
                    $scope.notice = notice;
                }
            );
        }
    };



    const refreshData = () => {
        getArtist($routeParams.artistId)
        .then(
            artist => {
                $scope.artist = artist;
                loadImage(
                    `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`,
                    '/img/default/artist.jpg')
                .then(src => $scope.artist.image = src);

                fetchLinks(artist, 'genres', 'genres');
                fetchLinks(artist, 'influences', 'artists');
                fetchLinks(artist, 'followers', 'artists');

            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    refreshData();
});
