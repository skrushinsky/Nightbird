angular.module('app').directive('nbGenres', function( ) {
    return {
        template : `
        <div ng-repeat="genre in genres">
            <div class="media">
        		<div class="media-left media-middle">
        			<img ng-src="{{ genre.image }}" class="media-object" style="width:80px">
        		</div>
        		<div class="media-body">
        			<h4 class="media-heading">{{ genre.name }}</h4>
                    <p>
        			    <span ng-bind-html="genre.description | limitTo : 240"></span>
                        <span ng-if="genre.description.length > 240">...</span>
                    </p>
                    <button type="button" class="btn btn-sm btn-default" ng-click="gotoGenre(genre.id)">
                      <span class="glyphicon glyphicon-chevron-right"></span> Learn More
                    </button>
        		</div>
        	</div>
        	<hr>
        </div>

        `,
        restrict: 'E',
        scope: {
            genres: '='
        },
        controller: ($scope, $location, $log) => {
            $scope.gotoGenre = id => $location.path(`/genres/${id}`);
        }
    }
});
