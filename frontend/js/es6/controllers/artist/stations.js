/* Controllers */

angular.module('app').controller('ArtistStationsController', ($scope, $log, $route, $routeParams, $location, getArtist, fetchLinks) => {
    $scope.stations = [];

    getArtist($routeParams.artistId).then(
        artist => {
            $scope.artist = artist;
            fetchLinks(artist, 'stations', 'stations')
                .then(
                    stations => {
                        $log.debug(JSON.stringify(stations));
                        $scope.stations = stations;
                        $scope.gotoArtist = id => $location.path(`/artists/${id}`);
                    },
                    notice => $scope.notice = notice
                );
        },
        notice => $scope.notice = notice
    );

});
