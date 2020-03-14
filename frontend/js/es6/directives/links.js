angular.module('app').directive('nbLinks', function() {
    return {
        template : `
        <span ng-repeat="link in links track by link.id | orderBy:'name'"
              class="label"
              ng-class="link.colorClass"
              ng-click="link.callback()">{{ link.name }}
        </span>
        `,
        restrict: 'E',
        scope: {
            links: '=',
        }
        // ,
        // controller: ($scope, $log) => {
        //     $log.debug('Got links: %s', JSON.stringify($scope.links));
        // }
    }
});
