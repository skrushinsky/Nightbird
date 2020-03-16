angular.module('app')
	.constant('SEARCH_KEYS', {
		artist: 'artists',
		album: 'albums',
		track: 'tracks'
	})
	.service('searchService', ($q, $filter, $log, fetchPath, SEARCH_KEYS) => {
		let results = [];
		let meta = {};
		const buildRow = row => {
			const it = {};
			it.name = row.name;
			switch (row.type) {
				case 'artist':
					if (row.bios) {
						it.description = row.bios[0].bio;
					}
					it.path = `/artists/${row.id}`;
					break;
				case 'album':
					const released = $filter('date')(row.originallyReleased, 'longDate');
					it.description = `<a href="/artists/${row.contributingArtists.primaryArtist}">${row.artistName}</a>, ${released}`;
					it.path = `/albums/${row.id}`;
					break;
				case 'track':
					it.description = `By <a href="/artists/${row.artistId}">${row.artistName}</a>, album: <a href="/albums/${row.albumId}">${row.albumName}</a>`;
					it.preview = row.previewURL;
			}
			results.push(it);
		};

		const searchType = (query, type, offset=0, page=1) => {
			const t = type.toLowerCase();
			if (!(t in SEARCH_KEYS)) {
				return $q.reject(`Unknown type: "${type}"`);
			}
			results = [], meta = {}; // clear previous results
			return fetchPath(`search?type=${t}&query=${query}&offset=${offset}`)
				.then(
					res => {
                        const rows = res.search.data[SEARCH_KEYS[t]];
						for (let row of rows) {
							buildRow(row);
						}
						meta = res.meta;
						meta.offset = offset;
						meta.page = page;
						meta.query = query;
						meta.type = type;
						return meta;
					}, err => $q.reject(err)
				);
		};

		const getResults = () => results;
		const getMeta = () => meta;

		return {
			searchType,
			getResults,
			getMeta
		}
	});
