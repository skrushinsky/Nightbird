angular.module('app').directive('nbLinks', function() {
    return {
        template : `
        <a ng-repeat="link in links track by link.id"
           ng-href="{{ link.href }}">
           <span style="white-space: nowrap">{{ link.name }}<span ng-if="!$last">,&nbsp;</span></span>
        </a>
        `,
        restrict: 'E',
        scope: {
            links: '=',
        }
    }
});
