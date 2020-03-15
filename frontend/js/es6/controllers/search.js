/* Controllers */

angular.module('app').controller('SearchController', ($scope, $log, $route, $location, searchService) => {

    $scope.query = '';
    $scope.type = 'Artist';
    $scope.submit = () => {
        if ($scope.query) {
            searchService.searchType($scope.query, $scope.type).then(
                res => {
                    $log.debug('Search result: %s', JSON.stringify(res));
                    $location.path(`/search/results`);
                }, notice => {
                    $log.error(notice);
                }
            );
        }
    }
});
