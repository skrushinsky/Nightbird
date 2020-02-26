angular.module('app').directive('nbSlideshow', function() {
    return {
        template : `
        <div style="height: {{ height }}">
        	<div uib-carousel active="active" interval="interval">
        		<div uib-slide ng-repeat="slide in slides track by slide.id" index="$index">
                    <img ng-src="{{ slide.image }}" style="margin:auto;">
        			<div class="carousel-caption" ng-click="slide.callback()">
        				<h4>{{slide.name}}</h4>
        			</div>
        		</div>
        	</div>
        </div>`,
        restrict: 'E',
        scope: {
            slides: '=',
            active: '=',
            interval: '=?',
            height: '=?'
        },
        controller: $scope => {
          $scope.interval = angular.isDefined($scope.interval) ? $scope.interval : 5000;
          $scope.height = angular.isDefined($scope.height) ? $scope.height : '300px';
        }
    }
});
