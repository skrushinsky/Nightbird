angular.module('app').directive('nbSlideshow', function() {
    return {
        template : `
        <div style="height: {{ height }}">
            <div ng-if="!slides || slides.length < 1" class="progress" style="margin-top: 100px;">
              <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                <span>Please wait<span class="dotdotdot"></span></span>
              </div>
            </div>
        	<div ng-if="slides && slides.length > 0" uib-carousel active="active" interval="interval">
        		<div uib-slide ng-repeat="slide in slides track by slide.id" index="$index" ng-click="slide.callback()">
                    <img ng-src="{{ slide.image }}" style="margin:auto;">
        			<div class="carousel-caption">
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
        controller: ($scope, $log) => {
          $scope.interval = angular.isDefined($scope.interval) ? $scope.interval : 5000;
          $scope.height = angular.isDefined($scope.height) ? $scope.height : '300px';
        }
    }
});
