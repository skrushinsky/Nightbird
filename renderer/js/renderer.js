// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const sectionNames = ['Genres', 'Artists', 'Albums', 'Tracks', 'Stations'];
let currentSection = null;
const ipcRenderer = window.ipcRenderer;
let childQuery = '';

nunjucks.configure('views', {
    autoescape: false
});

function renderTemplate(fileName, context, section = '#main') {
    console.debug('Rendering template %s', fileName);
    return new Promise((resolve, reject) => {
        nunjucks.render(fileName, context, (err, res) => {
            if (err) {
                console.error('Error rendering template: %s', err);
                reject(err)
            } else {
                $(section).html(res);
                resolve(res);
            }
        });
    });
}

ipcRenderer.on('navigate-to', (event, url) => {
    console.log('set-url event, %s', url);
    router.handle(url);
});

function renderGenres(genres) {
    return new Promise((resolve, reject) => {
        const ul = $('#genres-list');
        for (let genre of genres) {
            genre.image = `${IMG_ROOT}/images/${genre.id}/161x64.jpg`;
            const li = $('<li class="collection-item avatar"/>');
            const img = `<img src="${genre.image}" alt="" class="circle"/>`;
            li.append($(img));
            const span = $('<span class="title"/>');
            const a = `<a href="/genres/${genre.id}">${genre.name}</a>`;
            span.append($(a));
            li.append(span);
            li.append($('<br>'));
            descr = `<span class="description">${genre.description}</span>`;
            li.append($(descr));
            ul.append(li);
            $('span.description').succinct();
        }
        resolve(ul);
    });
}

async function getGenre(id) {
    const data = await fetchData(`${API_ROOT}/genres/${id}`);
    const genre = data.genres[0];
    genre.image = `${IMG_ROOT}/images/${id}/240x160.jpg`;
    const artists = await fetchData(`${API_ROOT}/genres/${id}/artists/top`);
    genre.artists = artists.artists.map( artist => {
        artist.image =  `${IMG_ROOT}/v2/artists/${artist.id}/images/356x237.jpg`;
        return artist;
    });
    if (genre.links['childGenres']) {
        genre.hasChildren = true;
        const children = await fetchData(genre.links.childGenres.href);
        genre.children = children.genres.map( child => {
            child.image =  `${IMG_ROOT}/images/${child.id}/240x160.jpg`;
            return child;
        });
    } else {
        genre.hasChildren = false;
    }
    const albums = await fetchData(`${API_ROOT}/genres/${id}/albums/top`);
    genre.albums = albums.albums.map( album => {
        album.image =  `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`;
        return album;
    });
    return genre;
}

async function getArtist(id) {
    const data = await fetchData(`${API_ROOT}/artists/${id}`);
    const artist = data.artists[0];
    //console.debug('artist: %s', JSON.stringify(artist));
    artist.image = `${IMG_ROOT}/v2/artists/${id}/images/356x237.jpg`;
    const albums = await fetchData(`${API_ROOT}/artists/${id}/albums`);
    artist.albums = albums.albums.map( album => {
        album.image =  `${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`;
        return album;
    });
    return artist;
}

async function getAlbum(id) {
    const data = await fetchData(`${API_ROOT}/albums/${id}`);
    const album = data.albums[0];
    console.debug('album: %s', JSON.stringify(album));
    album.image = `${IMG_ROOT}/v2/albums/${id}/images/300x300.jpg`;
    album.years = ['originallyReleased', 'released']
        .filter( k => album[k] )
        .map( k => new Date( album[k]).getFullYear());
    album.years = album.years.filter((item, index) => album.years.indexOf(item) === index);
    const tracksData = await fetchData(album.links.tracks.href);
    const tracks = tracksData.tracks;
    const discs = [];
    for (let i = 1; i <= album.discCount; i++) {
        discs.push(tracks.filter(t => t.disc === i));
    }
    album.discs = discs;

    console.log('tracks: %s', JSON.stringify(tracks));
    return album;
}


function createGenresBreadcrumbsItem(val, idx, arr) {
    const path = `/genres/${val.id}`;
    let uri;
    if (idx > 0) {
        const qs = arr.slice(0, idx).map(p => `parent=${p.id}|${p.name}`).join('&');
        uri = `${path}?${qs}`;
    } else {
        uri = path;
    }
    return { title: val.name, href: uri }
}

function getHistory(query) {
    return new URLSearchParams(query).getAll('parent').map(s => {
        const [id, name] = s.split('|');
        return { id, name }
    });
}


router.addRoute('/genres', async (uri, params) => {
    await renderTemplate('genres.html');
    try {
        const genres = await fetchGenres();
        const li = await renderGenres(genres);
        await renderTemplate('breadcrumbs.html', {
            path: [{
                title: 'Genres',
                href: '/genres'
            }]
        }, '#breadcrumbs');
    } catch (err) {
        console.error(err);
    }
});


router.addRoute('/genres/:id', async (uri, params, query) => {
    let history = getHistory(query);
    // console.debug('handling genre: %s, parents: %s', params.id, JSON.stringify(parents) );
    const genre = await getGenre(params.id);
    history.push({id: genre.id, name: genre.name});
    childQuery = history.map(p => `parent=${p.id}|${p.name}`).join('&');
    await renderTemplate('genre.html', {genre});

    $(document).on('click', '#genre-children > .carousel > .active', function() {
        const childId = $(this).data().id;
        router.handle(`/genres/${childId}?${childQuery}`);
    });
    $(document).on('click', '#genre-artists > .carousel > .active', function() {
        const artistId = $(this).data().id;
        router.handle(`/genres/${genre.id}/artists/${artistId}?${childQuery}`);
    });
    $(document).on('click', '#genre-albums > .carousel > .active', function() {
        const albumId = $(this).data().id;
        router.handle(`/genres/${genre.id}/albums/${albumId}?${childQuery}`);
    });

    const path = history.map( createGenresBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});


router.addRoute('/genres/:genre_id/artists/:artist_id', async (uri, params, query) => {
    console.log('Handling artist');
    const history = getHistory(query);
    const artist = await getArtist(params.artist_id);
    childQuery = history.map(p => `parent=${p.id}|${p.name}`).join('&');
    await renderTemplate('artist.html', {artist});
    $(document).on('click', '#artist-page > .carousel > .active', function() {
        const albumId = $(this).data().id;
        router.handle(`/genres/${params.genre_id}/artists/${params.artist_id}/albums/${albumId}?${childQuery}`);
    });
    const path = history.map( createGenresBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    path.push({ title: artist.name });
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});

router.addRoute('/genres/:genre_id/albums/:album_id', async (uri, params, query) => {
    console.log('Handling album');
    const history = getHistory(query);
    const album = await getAlbum(params.album_id);
    await renderTemplate('album.html', {album});
    const path = history.map( createGenresBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    path.push({ title: album.name });
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});


$(document).ready(() => {
    M.AutoInit();
    router.handle('/genres');
})
