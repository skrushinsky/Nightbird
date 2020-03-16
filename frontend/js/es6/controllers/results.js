
angular.module('app').controller('ResultsController', ($scope, $log, $location, searchService) => {
    $scope.results = searchService.getResults().map(res => {
        const title = res.name || '';
        res.title = title.split('/').join(' ');
        return res;
    });
    const meta = searchService.getMeta();

    $scope.currentPage = meta.page;
    $scope.maxSize = 12;
    $scope.totalItems = meta.totalCount;
    $scope.itemsPerPage = 20;

    const nextSearch = () => {
        const newOffset = ($scope.currentPage - 1) * meta.returnedCount;
        $log.debug('newOffset: %d, page: %d', newOffset, $scope.currentPage);
        $location.path(`/search/wait`);
        searchService.searchType(meta.query, meta.type, newOffset, $scope.currentPage).then(
            res => {
                $log.debug('Search result: %s', JSON.stringify(res));
                $location.path(`/search/results`);
            }, notice => {
                $log.error(notice);
            }
        );
    }
    $scope.pageChanged =  () => {
        $log.debug('Page changed to: ' + $scope.currentPage);
        nextSearch();
    };

});
