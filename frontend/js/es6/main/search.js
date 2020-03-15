angular.module('app')
	.constant(SEARCH_KEYS, {
		artist: 'artists',
		album: 'albums',
		track: 'tracks'
	})
	.service('searchService', ($q, $filter, $log, fetchPath, loadImage, IMG_ROOT, SEARCH_KEYS) => {
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
					it.description = `<a href="/artists/${row.artistId}">${row.artistName}</a>, ${released}`;
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
			if (!(t in SEARCH_KEYS)) {
				return $q.reject(`Unknown type: "${type}"`);
			}
			results.splice(0, results.length); // clear previous results
			return fetchPath(`search?type=${t}&query=${query}`)
				.then(
					res => {
                        const rows = res.search.data[SEARCH_KEYS[t]];
						for (let row of rows) {
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
