angular.module('app').directive('nbResults', function( ) {
    return {
        template : `
        <div ng-repeat="res in results">
           <div ng-if="res.description">
               <div class="row">
                   <div class="col-sm-12 col-lg-12 col-md-12">
                       <h4 class="media-heading">
                           <span ng-bind-html="res.name | limitTo : 100"></span>
                           <span ng-if="res.description.length > 100">...</span>
                       </h4>
                   </div>
               </div>
               <div class="row">
                   <div class="col-sm-12 col-lg-6 col-md-6">
                       <p>
                           <span ng-bind-html="res.description | limitTo : 250"></span>
                           <span ng-if="res.description.length > 250">...</span>
                       </p>
                   </div>
                   <div ng-if="res.preview" class="col-sm-12 col-lg-4 col-md-4">
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
           <div ng-if="!res.description">
               <div class="row">
                   <div class="col-sm-12 col-lg-6 col-md-6">
                       <h4 class="media-heading">
                           <span ng-bind-html="res.name | limitTo : 100"></span>
                           <span ng-if="res.description.length > 100">...</span>
                       </h4>
                   </div>
                   <div ng-if="res.preview" class="col-sm-12 col-lg-4 col-md-4">
                       <audio controls>
                           <source ng-src="{{ res.preview }}" type="audio/mpeg">
                           Your browser does not support the audio element.
                       </audio>
                   </div>
                   <div ng-if="res.path" class="col-sm-12 col-lg-2 col-md-2">
                       <button type="button" class="btn btn-sm btn-default" ng-click="gotoResult(res.path)">
                         <span class="glyphicon glyphicon-chevron-right"></span> Learn More
                       </button>
                   </div>
               </div>
           </div>
           <hr/>
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
