angular.module('app').directive('nbResults', function( ) {
    return {
        template : `
        <div ng-repeat="res in results">
            <div class="media">
        		<div class="media-left media-middle">
        			<img ng-if="res.image" ng-src="{{ res.image }}" class="media-object" style="width:100px">
        		</div>
        		<div class="media-body">
                    <div class="row">
                        <div class="col-sm-12 col-lg-12 col-md-12">
                            <h4 class="media-heading">
                            <span ng-bind-html="res.name | limitTo : 100"></span>
                            <span ng-if="res.description.length > 100">...</span>
                            </h4>
                        </div>
                        <div class="col-sm-12 col-lg-6 col-md-6">
                            <p style="margin-top: 14px;">
                			    <span ng-bind-html="res.description | limitTo : 250"></span>
                                <span ng-if="res.description.length > 250">...</span>
                            </p>
                        </div>
                        <div ng-if="res.preview" class="col-sm-12 col-lg-4 col-md-4 center-block">
                            <audio controls>
                                <source ng-src="{{ res.preview }}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        <div ng-if="res.path" class="col-sm-12 col-lg-4 col-md-4">
                            <button type="button" class="btn btn-sm btn-default" ng-click="gotoResult(res.path)">
                              <span class="glyphicon glyphicon-chevron-right"></span> Learn More
                            </button>
                        </div>
                    </div>
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
