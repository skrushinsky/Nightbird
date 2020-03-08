angular.module('app')
    .constant('API_ROOT', 'https://api.napster.com/v2.2')
    .constant('IMG_ROOT', 'https://api.napster.com/imageserver')
    .constant('HEADERS', {
        'Content-Type': 'application/json;charset=utf-8',
        apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
    })
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
    ).factory('fetchTracks', ($q, fetchPath) =>
        path => {
            return fetchPath(path).then(data => {
                return data.tracks.filter(t => 'id' in t);
            }, err => $q.reject(err));
        }
    ).service('searchService', ($q, $filter, fetchPath, loadImage, IMG_ROOT) => {
        const keys = {
            artist: 'artists',
            album: 'albums',
            track: 'tracks'
        };
        const results = [];

        const buildRow = row => {
            const it = {};
			let imgUrl;
            it.name = row.name;
            switch (row.type) {
                case 'artist':
                    if (row.bios) {
                        it.description = row.bios[0].bio;
                    }
					loadImage(
						`${IMG_ROOT}/v2/artists/${row.id}/images/356x237.jpg`,
						'/img/default/artist.jpg')
					.then(src => it.image = src);
                    it.path = `/artists/${row.id}`;
                    break;
                case 'album':
                    const released = $filter('date')(row.originallyReleased, 'longDate');
                    it.description = `${row.artistName}, ${released}`;
					loadImage(
						`${IMG_ROOT}/v2/albums/${row.id}/images/300x300.jpg`,
						'/img/default/album.jpg')
					.then(src => it.image = src);
                    it.path = `/albums/${row.id}`;
                    break;
                case 'track':
                    it.description = `By <a href="/artists/${row.artistId}">${row.artistName}</a>, album: <a href="/albums/${row.albumId}">${row.albumName}</a>`;
                    it.preview = row.previewURL;
					it.image = '/img/default/track.jpg'
                    break;
            }
            results.push(it);
        };

        const searchType = (query, type) => {
            const t = type.toLowerCase();
            if (!(t in keys)) {
                return $q.reject(`Unknown type: "${type}"`);
            }
            results.splice(0, results.length);
            return fetchPath(`search?type=${t}&query=${query}`)
                .then(
                    res => {
                        for (let row of res.search.data[keys[t]]) {
                            buildRow(row);
                        }
                        return res.meta;
                    }, err => $q.reject(err)
                );
        };

        const getResults = () => results;

        return {
            searchType,
            getResults
        }
    });
