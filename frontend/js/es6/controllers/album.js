angular.module('app').controller('AlbumController', ($scope, $log, $routeParams, fetchPath, IMG_ROOT) => {

    const albumId = $routeParams.albumId;


    const fetchTracks = album => {
        fetchPath(`/albums/${album.id}/tracks`)
        .then(data => {
            $scope.tracks = data.tracks;
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
    };

    const refreshData = () => {
        fetchPath(`/albums/${albumId}`)
        .then(
            data => {
                const album = data.albums[0];
                album.image = `${IMG_ROOT}/v2/albums/${albumId}/images/300x300.jpg`;
                fetchTracks(album);
                $scope.album = album;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    refreshData();
});
