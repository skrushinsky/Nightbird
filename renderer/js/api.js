const API_ROOT = 'https://api.napster.com/v2.2';
const IMG_ROOT = 'https://api.napster.com/imageserver';
const HEADERS = {
    'Content-Type': 'application/json;charset=utf-8',
    apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
}


async function fetchGenres(callback) {
    console.debug('Fetching genres...');
    try {
        const resp = await fetch(`${API_ROOT}/genres`, { headers: HEADERS});
        const data = await resp.json();
        for (let genre of data.genres ) {
            genre.image = `${IMG_ROOT}/images/${genre.id}/161x64.jpg`;
            callback(genre);
        }
    } catch (err) {
        console.log(err);
    }
}
