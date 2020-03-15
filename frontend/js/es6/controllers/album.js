angular.module('app').controller('AlbumController', ($scope, $log, $routeParams, fetchPath, fetchLinks, fetchTracks, loadImage, IMG_ROOT) => {

    const albumId = $routeParams.albumId;
    $scope.discs = []

    const fetchAlbumTracks = album => {
        fetchTracks(`/albums/${album.id}/tracks`)
        .then(tracks => {
            for (let i = 0; i < album.discCount; i++) {
                $scope.discs.push(tracks.filter( tr => 'disc' in tr && tr.disc === i + 1))
            }
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
                fetchAlbumTracks(album);
                fetchLinks(album, 'genres', 'genres')
                .then(
                    links => $scope.genres = links.map( lnk => {
                        lnk.href = `/genres/${lnk.id}`;
                        return lnk;
                    }),
                    notice => {
                        $log.warn('Got notice: %s', notice);
                        $scope.notice = notice;
                    }
                );

                $scope.album = album;
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            }
        );
    };

    refreshData();
});
