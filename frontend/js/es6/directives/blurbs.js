angular.module('app').directive('nbBlurbs', function() {
    return {
        template: `
        <div class="blurbs" style="height: {{ height }}px;">
          <div ng-animate-swap="text" class="well well-lg swap-animation" ng-class="colorClass(colorIndex)">
            <p ng-bind-html="text"></p>
          </div>
        </div>
        `,
        restrict: 'E',
        scope: {
            blurbs: '=',
            interval: '=?',
            height: '=?'
        },
        controller: ($scope, $interval, shuffleArray) => {
            const colors = shuffleArray(['bg-0', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6', 'bg-7']);
            $scope.interval = angular.isDefined($scope.interval) ? $scope.interval : 8000;
            $scope.height = angular.isDefined($scope.height) ? $scope.height : 300;
            $scope.textIndex = 0;
            $scope.colorIndex = 1;
            $scope.text = $scope.blurbs[0];

            $interval(() => {
                $scope.textIndex++;
                if ($scope.textIndex == $scope.blurbs.length) {
                    $scope.textIndex = 0;
                }
                $scope.colorIndex++;
                if ($scope.colorIndex == colors.length) {
                    $scope.colorIndex = 0;
                }
                $scope.text = $scope.blurbs[$scope.textIndex];
            }, $scope.interval);

            $scope.colorClass = idx => colors[idx % colors.length];
        }
    }
});
