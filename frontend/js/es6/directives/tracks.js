angular.module('app').directive('nbTracks', function() {
    return {
        template : `
        <table class="table table-striped">
            <caption ng-if="showdisc">Disc #{{ discnum }}</caption>
            <tr ng-repeat="track in tracks track by track.index">
                <td><span ng-if="showdisc">{{ track.disc }} - </span>{{ track.index }}</td>
                <td width=40%>{{ track.name }}</td>
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
            discnum: '=?'
        },
        controller: $scope => {
            $scope.showdisc = angular.isDefined($scope.showdisc) ? $scope.showdisc : false;
            $scope.disc = angular.isDefined($scope.discnum) ? $scope.discnum : 1;
        }
    }
});
