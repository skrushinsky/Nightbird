angular.module('app')
    .constant('API_ROOT', 'https://api.napster.com/v2.2')
    .constant('IMG_ROOT', 'https://api.napster.com/imageserver')
    .constant('HEADERS', {
        'Content-Type': 'application/json;charset=utf-8',
        apikey: API_KEY
    })
    .constant('COLOR_CLASSES', ['info', 'default', 'primary', 'warning', 'danger'])
    .factory('fetchUrl', ($q, $http, $log, API_ROOT, HEADERS) =>
        url => {
            const parsed = new URL(url);
            let q;
            if (parsed.search) {
                q = `${parsed.search}&lang=${LANG}`;
            } else {
                q = `?lang=${LANG}`;
            }
            let newUrl = `${parsed.origin}${parsed.pathname}${q}`;

            $log.debug('Fetching %s...', newUrl);
            return $http({
                method: 'GET',
                url: newUrl,
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
    .factory('getObject', ($q, fetchPath) =>
        (section, id) => {
            return fetchPath(`${section}/${id}`).then(data => {
                if (data[section].length === 0) {
                    return $q.reject(`Object ${id} not found in ${section}`);
                } else {
                    return data[section][0];
                }
            }, err => $q.reject(err))
        }
    ).factory('getGenre', getObject  => id => getObject('genres', id)
    ).factory('getArtist', getObject => id => getObject('artists', id)
    ).factory('getAlbum', getObject => id => getObject('albums', id)
    ).factory('fetchObjects', ($q, fetchPath, uniqId) =>
        (path, section) => {
            return fetchPath(path).then(
                data => data[section].filter( uniqId(data[section]) ),
                err => $q.reject(err));
        }
    ).factory('fetchAlbums', fetchObjects => path => fetchObjects(path, 'albums')
    ).factory('fetchReviews', fetchObjects => path => fetchObjects(path, 'reviews')
    ).factory('fetchTracks', fetchObjects => path => fetchObjects(path, 'tracks')
    ).factory('fetchLinks', ($q, $location, fetchUrl, shuffleArray, uniqId, COLOR_CLASSES) =>
        (obj, key, section) => {
            const linkColors = COLOR_CLASSES.map( c => `label-${c}` );
            if ( !('links' in obj)) {
                return $q.reject('Object has no links');
            }

            if ( !(key in obj.links)) {
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
