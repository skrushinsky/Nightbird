/* Controllers */

angular.module('app').controller('ArtistTracksController', ($scope, $log, $route, $routeParams, $location, fetchPath, fetchUrl, getArtist, fetchTracks) => {
    $scope.tracks = [];

    const refreshData = () => {
        getArtist($routeParams.artistId)
            .then(artist => {
                $scope.artist = artist;
                fetchTracks(`/artists/${artist.id}/tracks/top`)
                    .then(
                        tracks => {
                            $scope.tracks = tracks;
                            $scope.gotoArtist = id => $location.path(`/artists/${id}`);
                        }, notice => {
                            $log.warn('Got notice: %s', notice);
                            $scope.notice = notice;
                        }
                    );
            }, notice => {
                $log.warn('Got notice: %s', notice);
                $scope.notice = notice;
            });
    };
    refreshData();
});
