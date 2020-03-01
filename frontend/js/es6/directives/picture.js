angular.module('app').directive('nbPicture', function() {
    return {
        template : `
        <div class="shadow" style="margin-bottom: 10px;">
            <img ng-src="{{ src }}" class="media-object" style="width:{{ width }}px">
        </div>
        `,
        restrict: 'E',
        scope: {
            src: '=',
            width: '=?'
        },
        controller: $scope => {
            $scope.width = angular.isDefined($scope.width) ? $scope.width : 300;
        }
    }
});
