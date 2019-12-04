const API_ROOT = 'https://api.napster.com/v2.2';
const IMG_ROOT = 'https://api.napster.com/imageserver';
const HEADERS = {
    'Content-Type': 'application/json;charset=utf-8',
    apikey: 'Y2JmZGI2ZmMtM2RiZC00ZjUwLWEzMzItMGFiYjcyNDJmMjg2'
}


async function fetchData(url) {
    try {
        const resp = await fetch(url, { headers: HEADERS});
        const data = await resp.json();
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function fetchGenres() {
    console.debug('Fetching genres...');
    const data = await fetchData(`${API_ROOT}/genres`);
    return data.genres;
}
