angular.module('app').controller('ArtistController', ($scope, $log, $routeParams, $location, fetchPath, IMG_ROOT) => {

    const artistId = $routeParams.artistId;
    $scope.albums = [];
    $scope.tracks = [];

    const fetchAlbums = artist => {
        fetchPath(`/artists/${artist.id}/albums/top`)
        .then(data => {
            for(let album of data.albums) {
                album.date = Date.parse(album.originallyReleased);
                album.image = `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`;
                album.callback = () => $location.path(`/albums/${album.id}`);
            }
            $scope.albums = data.albums.filter( a => 'id' in a);
            if ($scope.albums.length) {
                $scope.activeSlide = $scope.albums[0].id;
            }
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
    };

    const fetchTracks = artist => {
        fetchPath(`/artists/${artist.id}/tracks/top`)
        .then(data => {
            $scope.tracks = data.tracks.filter( t => 'id' in t);
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
                fetchTracks(artist);
                $scope.artist = artist;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    refreshData();
});
