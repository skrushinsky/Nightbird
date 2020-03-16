angular.module('app').controller('StationController', ($scope, $log, $routeParams, getStation, fetchLinks) => {

    $scope.play = stationId => {
        $log.debug('Playing...');
    }

    getStation($routeParams.stationId)
    .then(
        station => {
            $scope.station = station;
            $log.debug('Station: %s', JSON.stringify(station));
            fetchLinks(station, 'genres', 'genres')
            .then(
                links => $scope.genres = links,
                notice => $scope.notice = notice
            );
        }, notice => $scope.notice = notice
    );
});
