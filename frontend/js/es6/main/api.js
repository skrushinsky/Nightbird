angular.module('app')
    .constant('API_ROOT', 'https://api.napster.com/v2.2')
    .constant('IMG_ROOT', 'https://api.napster.com/imageserver')
    .constant('HEADERS', {
        'Content-Type': 'application/json;charset=utf-8',
        apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
    })
    .constant('COLOR_CLASSES', ['info', 'default', 'primary', 'warning', 'danger'])
    .factory('fetchUrl', ($q, $http, $log, API_ROOT, HEADERS) =>
        url => {
            $log.debug('Fetching %s...', url);
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
            return fetchPath(`genres/${id}`).then(data => {
                if (data.genres.length === 0) {
                    return $q.reject(`Genre ${id} not found`);
                } else {
                    return data.genres[0];
                }
            }, err => $q.reject(err))
        }
    ).factory('getArtist', ($q, fetchPath) =>
        id => {
            return fetchPath(`artists/${id}`).then(data => {
                if (data.artists.length === 0) {
                    return $q.reject(`Artist ${id} not found`);
                } else {
                    return data.artists[0];
                }
            }, err => $q.reject(err));
        }
    ).factory('fetchTracks', ($q, fetchPath, uniqId) =>
        path => {
            return fetchPath(path).then(data => {
                return data.tracks.filter( uniqId(data.tracks) );
            }, err => $q.reject(err));
        }
    ).factory('fetchLinks', ($q, $location, fetchUrl, shuffleArray, uniqId, COLOR_CLASSES) =>
        (obj, key, section) => {
            const linkColors = COLOR_CLASSES.map( c => `label-${c}` );
            if (!(key in obj.links)) {
                return $q.reject(`Key ${key} not found in the object links`);
            }
            return fetchUrl(obj.links[key].href)
            .then(
                data => {
                    const colors = shuffleArray(linkColors);
                    const arr = data[section];
                    return arr.filter(uniqId(arr)).map( (item, i) => {
                        return {
                            id: item.id,
                            name: item.name,
                            callback: () => $location.path(`/${section}/${item.id}`),
                            href: `/${section}/${item.id}`,
                            colorClass: colors[ i % colors.length ]
                        }
                    });
                },
                err => $q.reject(err)
            )
        }

    );
