const API_ROOT = 'https://api.napster.com/v2.2';
const IMG_ROOT = 'https://api.napster.com/imageserver';
const HEADERS = {
    'User-Agent': 'Request-Promise',
    apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
}

function fetchGenres() {
    return new Promise((resolve, reject) => {
        console.debug('Fetching genres...');
        try {
            const resp = await fetch(`${API_ROOT}/genres`);
            const genres = resp.json.genres.map( it => handleGenre(it) );
            resolve(genres);
        } catch ( err ) {
            reject(err);
        }
    });
}
