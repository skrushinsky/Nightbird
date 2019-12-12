// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const sectionNames = ['Genres', 'Artists', 'Albums', 'Tracks', 'Stations'];
let currentSection = null;
const ipcRenderer = window.ipcRenderer;

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
    return genre;
}

async function getArtist(id) {
    const data = await fetchData(`${API_ROOT}/artists/${id}`);
    const artist = data.artists[0];
    console.debug('artist: %s', JSON.stringify(artist));
    artist.image = `${IMG_ROOT}/v2/artists/${id}/images/356x237.jpg`;
    return artist;
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
    const history = getHistory(query);
    // console.debug('handling genre: %s, parents: %s', params.id, JSON.stringify(parents) );
    const genre = await getGenre(params.id);
    history.push({id: genre.id, name: genre.name});
    const childQuery = history.map(p => `parent=${p.id}|${p.name}`).join('&');
    await renderTemplate('genre.html', {genre});

    $(document).on('click', '#genre-children > .carousel > .active', function() {
        const childId = $(this).data().id;
        router.handle(`/genres/${childId}?${childQuery}`);
    });
    //await renderArtists(genre.artists);
    $(document).on('click', '#genre-artists > .carousel > .active', function() {
        const artistId = $(this).data().id;
        router.handle(`/genres/${genre.id}/artists/${artistId}?${childQuery}&genre_name=${genre.name}`);
    });

    const path = history.map( createGenresBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});


router.addRoute('/genres/:genre_id/artists/:artist_id', async (uri, params, query) => {
    console.log('Handling artist');
    const history = getHistory(query);
    history.push({
        id: params.genre_id,
        name: new URLSearchParams(query).getAll('genre_name')
    });
    const artist = await getArtist(params.artist_id);
    await renderTemplate('artist.html', {artist});

    $('.tabs').tabs();
    $('.tabs').on('click', 'a', function(e) {
        $('.carousel').carousel();
    });

    const path = history.map( createGenresBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    path.push({ title: artist.name });
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});


$(document).ready(() => {
    M.AutoInit();
    router.handle('/genres');
})
