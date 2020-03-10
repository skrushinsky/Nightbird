/* Controllers */

angular.module('app').controller('ArtistAlbumsController', ($scope, $log, $route, $routeParams, $location, fetchPath, getArtist, loadImage, IMG_ROOT) => {
    $scope.albums = [];

    const refreshData = () => {
        getArtist($routeParams.artistId)
        .then(
            artist => {
                $scope.artist = artist;
                $scope.gotoArtist = id => $location.path(`/artists/${id}`);
                fetchPath(`/artists/${artist.id}/albums/top`)
                .then(data => {
                    for(let album of data.albums) {
                        if (!('id' in album)) {
                            continue;
                        }
                        album.date = Date.parse(album.originallyReleased);
                        loadImage(
                             `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`,
                            '/img/default/album.jpg')
                        .then(src => album.image = src);
                        album.callback = () => $location.path(`/albums/${album.id}`);
                        $scope.albums.push(album);
                    }
                    if ($scope.albums.length) {
                        $scope.activeSlide = $scope.albums[0].id;
                    }
                }, notice => {
                    $log.warn('Got notice: %s', notice);
                    $scope.notice = notice;
                });
            }
        );
    };

    refreshData();
});
