angular.module('app')
	.constant('API_ROOT', 'https://api.napster.com/v2.2')
	.constant('IMG_ROOT', 'https://api.napster.com/imageserver')
	.constant('HEADERS', {
		'Content-Type': 'application/json;charset=utf-8',
		apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
	})
    .factory('fetchUrl', ($q, $http, $log, API_ROOT, HEADERS) =>
		url => {
            console.log('Fetching %s...', url);
			return $http({
				method: 'GET',
				url: url,
				headers: HEADERS
			}).then(response => {
				return response.data
			}, response => {
				$log.warn(response.error.message);
				return $q.reject(response.error.message);
			});
		}
	)
	.factory('fetchPath', (fetchUrl, API_ROOT, HEADERS) =>
        path => fetchUrl(`${API_ROOT}/${path}`)
	)
    .factory('getGenre', ($q, fetchPath) =>
        id => {
            return fetchPath(`/genres/${id}`).then(data => {
                if (data.genres.length === 0) {
                    return $q.reject(`Genre ${id} not found`);
                } else {
                    return data.genres[0];
                }
            }, err => $q.reject(err))
        }
    ).factory('fetchTracks', ($q, fetchPath) =>
         path => {
             return fetchPath(path).then(data => {
                 return data.tracks.filter( t => 'id' in t);
             }, err => $q.reject(err));
         }
    );
