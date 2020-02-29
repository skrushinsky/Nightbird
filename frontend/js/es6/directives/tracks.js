angular.module('app').directive('nbTracks', function() {
    return {
        template : `
        <table class="table table-striped">
            <caption ng-if="showdisc">Disc #{{ discnum }}</caption>
            <tr ng-repeat="track in tracks track by track.id">
                <td><span ng-if="showdisc">{{ track.disc }} - </span>{{ $index + 1 }}.</td>
                <td>
                    {{ track.name  | limitTo : 30 }}
                    <span ng-if="track.name.length > 30">...</span>
                </td>
                <td ng-if="showalbum">
                    {{ track.albumName | limitTo : 30 }}
                    <span ng-if="track.albumName.length > 30">...</span>
                </td>
                <td>{{ track.playbackSeconds | formatSeconds }}</td>
                <td>
                    <audio controls>
                        <source src="{{ track.previewURL }}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </td>
            <tr>
        </table>
        `,
        restrict: 'E',
        scope: {
            tracks: '=',
            showdisc: '=?',
            discnum: '=?',
            showalbum: '=?',
        },
        controller: $scope => {
            $scope.showdisc = angular.isDefined($scope.showdisc) ? $scope.showdisc : false;
            $scope.showalbum = angular.isDefined($scope.showalbum) ? $scope.showalbum : false;
            $scope.disc = angular.isDefined($scope.discnum) ? $scope.discnum : 1;
        }
    }
});