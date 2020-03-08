angular.module('app').directive('nbResults', function( ) {
    return {
        template : `
        <div ng-repeat="res in results">
            <div class="media">
        		<div class="media-left media-top">
        			<img ng-if="res.image" ng-src="{{ res.image }}" class="media-object" style="width:80px">
        		</div>
        		<div class="media-body">
        			<h4 class="media-heading">{{ res.name }}</h4>
                    <p>
        			    <span ng-bind-html="res.description | limitTo : 240"></span>
                        <span ng-if="res.description.length > 240">...</span>
                    </p>
                    <audio ng-if="res.preview" controls>
                        <source ng-src="{{ res.preview }}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <button ng-if="res.path" type="button" class="btn btn-sm btn-default" ng-click="gotoResult(res.path)">
                      <span class="glyphicon glyphicon-chevron-right"></span> Learn More
                    </button>
        		</div>
        	</div>
        	<hr>
        </div>

        `,
        restrict: 'E',
        scope: {
            results: '='
        },
        controller: ($scope, $location) => {
            $scope.gotoResult = path => $location.path(path);
        }
    }
});
