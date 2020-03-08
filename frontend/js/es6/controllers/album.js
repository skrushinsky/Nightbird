angular.module('app').controller('AlbumController', ($scope, $log, $routeParams, fetchPath, loadImage, IMG_ROOT) => {

    const albumId = $routeParams.albumId;
    $scope.discs = []

    const fetchTracks = album => {
        fetchPath(`/albums/${album.id}/tracks`)
        .then(data => {
            for (let i = 0; i < album.discCount; i++) {
                $scope.discs.push(data.tracks.filter( tr => 'disc' in tr && tr.disc === i + 1))
            }
            //$log.debug('discs: %s', JSON.stringify($scope.discs));
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
                loadImage(
                     `${IMG_ROOT}/v2/albums/${albumId}/images/300x300.jpg`,
                    '/img/default/album.jpg')
                .then(src => album.image = src);

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
