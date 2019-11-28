const request = require('request-promise-native');
const ROOT = 'https://api.napster.com/v2.2'
const HEADERS = {
	'User-Agent': 'Request-Promise',
	apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
}


module.exports = {

	fetchGenres: () => {
		return new Promise((resolve, reject) => {
      console.log('Fetching genres...');
			request({
				uri: `${ROOT}/genres`,
				qs: {},
				headers: HEADERS,
				json: true
			}).then(json => {
				resolve(json.genres);
			}).catch(err => {
				reject(err);
			});
		});
}


//
//
// getSectionHandler: (sectionName) => {
// 	switch (sectionName) {
// 		case 'Genres':
// 			return async () => {
//         return await getGenres();
//       }
// 		default:
// 			throw `Unknown section: "${sectionName}"`;
// 	}
// }
}
