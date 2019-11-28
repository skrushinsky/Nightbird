const request = require('request-promise-native');
const API_ROOT = 'https://api.napster.com/v2.2';
const IMG_ROOT = 'https://api.napster.com/imageserver';
const HEADERS = {
    'User-Agent': 'Request-Promise',
    apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
}


function handleGenre(raw) {
    const allowed = ['id', 'name', 'description'];
    const filtered = Object.keys(raw)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {});
	filtered.image = `${IMG_ROOT}/images/${filtered.id}/161x64.jpg`;
	return filtered;
}


module.exports = {

    fetchGenres: () => {
        return new Promise((resolve, reject) => {
            console.log('Fetching genres...');
            request({
                uri: `${API_ROOT}/genres`,
                qs: {},
                headers: HEADERS,
                json: true
            }).then(json => {
				const genres = json.genres.map( it => handleGenre(it) );
                resolve (genres);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
