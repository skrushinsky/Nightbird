angular.module('app').controller('AlbumController', ($scope, $log, $routeParams, getAlbum, fetchReviews, fetchTracks, fetchLinks, loadImage, IMG_ROOT) => {

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


    getAlbum($routeParams.albumId)
    .then(
        album => {
            $scope.album = album;
            loadImage(
                 `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`,
                '/img/default/album.jpg')
            .then(src => album.image = src);

            fetchAlbumTracks(album);

            fetchLinks(album, 'genres', 'genres').then(
                links => $scope.genres = links,
                notice =>$scope.notice = notice
            );
            const artistId = 'contributingArtists' in album
                          && 'primaryArtist' in album.contributingArtists ? album.contributingArtists.primaryArtist
                                                                                                            : null;
            fetchLinks(album, 'artists', 'artists').then(
                links => $scope.artists = links.filter( lnk => lnk.id !== artistId ),
                notice => $scope.notice = notice
            );

            fetchReviews(`/albums/${album.id}/reviews`).then(
                reviews => $scope.reviews = reviews,
                notice =>$scope.notice = notice
            );


        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        }
    );

});
