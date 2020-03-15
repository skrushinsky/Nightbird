
angular.module('app').directive('nbWait', function() {
    return {
        template : `
        <div class="wait alert alert-{{ colorClass }}"
             ng-class="'alert-' + colorClass">
            <div class="glyphicon glyphicon-hourglass"></div>
            <div><h4 ng-hide="off" ng-bind-html="message"></h4></div>
        </div>
        `,
        restrict: 'E',
        scope: {
            message: '=?',
            colorClass: '=?',
            delay: '=?'
        },
        controller: ($scope, $timeout) => {
            $scope.message = angular.isDefined($scope.message) ? $scope.message : 'Please, wait...';
            $scope.colorClass = angular.isDefined($scope.colorClass) ? $scope.colorClass : 'info';
            $scope.delay = angular.isDefined($scope.delay) ? $scope.delay : 1000;

            $scope.off = false;

            const fadeIn = () => $timeout( () => {
                $scope.off = true;
                fadeOut();
            }, $scope.delay);

            const fadeOut = () => $timeout( () => {
                $scope.off = false;
                fadeIn();
            }, $scope.delay);

            fadeIn();
        }
    }
});
