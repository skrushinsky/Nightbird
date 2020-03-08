/* Controllers */

angular.module('app').controller('ResultsController', ($scope, $log, searchService) => {
    $scope.results = searchService.getResults();
});
