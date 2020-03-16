angular.module('app').directive('nbResults', function( ) {
    return {
        template : `
        <div class="search-result row" ng-repeat="res in results">
            <div ng-if="res.name || res.description" class="col-sm-12 col-lg-6 col-md-6">
                <div class="row">
                    <div ng-if="res.name" class="col-sm-12 col-lg-12 col-md-12">
                        <h4>
                            <span ng-bind-html="res.name | limitTo : 100"></span>
                            <span ng-if="res.description.length > 100">...</span>
                        </h4>
                    </div>
                    <div ng-if="res.description" class="col-sm-12 col-lg-12 col-md-12">
                        <p>
                            <span ng-bind-html="res.description | limitTo : 250"></span>
                            <span ng-if="res.description.length > 250">...</span>
                        </p>
                    </div>
                </div>
            </div>
            <div ng-if="res.preview" class="col-sm-12 col-lg-6 col-md-6">
                <audio controls class="pull-left">
                    <source ng-src="{{ res.preview }}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div ng-if="res.path" class="col-sm-12 col-lg-6 col-md-6">
                <button type="button" class="btn btn-sm btn-default pull-left" ng-click="gotoResult(res.path)">
                  <span class="glyphicon glyphicon-chevron-right"></span> Learn More
                </button>
            </div>
        </div>`,
        restrict: 'E',
        scope: {
            results: '='
        },
        controller: ($scope, $location) => {
            $scope.gotoResult = path => $location.path(path);
        }
    }
});
