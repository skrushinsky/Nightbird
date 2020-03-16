/* Controllers */

angular.module('app').controller('ArtistTracksController', ($scope, $log, $route, $routeParams, $location, getArtist, fetchTracks) => {

    getArtist($routeParams.artistId).then(
        artist => {
            $scope.artist = artist;
            fetchTracks(`/artists/${artist.id}/tracks/top`).then(
                tracks => {
                    $scope.tracks = tracks;
                    $scope.gotoArtist = id => $location.path(`/artists/${id}`);
                },
                notice => $scope.notice = notice
            );
        },
        notice => $scope.notice = notice
    );
});
