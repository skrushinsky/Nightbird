angular.module('app').directive('nbSlideshow', function() {
    return {
        template: `
        <div ng-if="!slides || slides.length === 0">
            <nb-wait data-message="'Loading. Please, wait...'"/>
        </div>
        <div ng-if="slides && slides.length > 0" style="height: {{ height }}">
        	<div uib-carousel active="active" interval="interval">
        		<div uib-slide ng-repeat="slide in slides track by slide.id" index="$index" ng-click="slide.callback()">
                    <img ng-src="{{ slide.image }}" style="margin:auto; height: {{ height }}">
        			<div ng-if="showTitles" class="carousel-caption">
        				<h4>{{ slide.name }}</h4>
        			</div>
        		</div>
        	</div>
        </div>`,
        restrict: 'E',
        scope: {
            slides: '=',
            active: '=',
            interval: '=?',
            height: '=?',
        },
        controller: ($scope, $log) => {
            $scope.interval = angular.isDefined($scope.interval) ? $scope.interval : 5000;
            $scope.height = angular.isDefined($scope.height) ? $scope.height : '300px';
        },
        link: (scope, elem, attrs) => {
            scope.showTitles = !attrs.hasOwnProperty('noTitles')
        }
    }
});
