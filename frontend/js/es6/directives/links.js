angular.module('app').directive('nbLinks', function() {
    return {
        template : `
        <span ng-repeat="link in links track by link.id">
           <a ng-href="{{ link.href }}" style="white-space: nowrap">{{ link.name }}</a><span ng-if="!$last">,&nbsp;</span>
        </span>
        `,
        restrict: 'E',
        scope: {
            links: '=',
        }
    }
});
