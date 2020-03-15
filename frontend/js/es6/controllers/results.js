
angular.module('app').controller('ResultsController', ($scope, $log, searchService) => {
    $scope.results = searchService.getResults().map(res => {
        const title = res.name || '';
        res.title = title.split('/').join(' ');
        return res;
    });
    $log.debug('Results: %s', JSON.stringify($scope.results));
});
