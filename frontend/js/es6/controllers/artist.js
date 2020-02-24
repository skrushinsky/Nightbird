angular.module('app').controller('ArtistController', ($scope, $log, $routeParams, $location, fetchPath, IMG_ROOT) => {

    const artistId = $routeParams.artistId;
    $scope.albums = [];

    $scope.slidesInterval = 0;
    $scope.startCarousel = () => {
        $log.debug('Starting carousel');
        $scope.slidesInterval = 5000;
    };

    const fetchAlbums = artist => {
        fetchPath(`/artists/${artist.id}/albums/top`)
        .then(data => {
            for(let album of data.albums) {
                album.date = Date.parse(album.originallyReleased);
                album.image = `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`;
                album.callback = () => $location.path(`/albums/${album.id}`);
            }
            $scope.albums = data.albums;
            //.sort( (a, b) => a.date - b.date);
            //$log.debug('Albums: %s', JSON.stringify($scope.albums));
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
    };

    const refreshData = () => {
        fetchPath(`/artists/${artistId}`)
        .then(
            data => {
                const artist = data.artists[0];
                artist.image = `${IMG_ROOT}/v2/artists/${artistId}/images/356x237.jpg`;
                fetchAlbums(artist);
                $scope.artist = artist;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    refreshData();
});
