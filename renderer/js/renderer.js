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

function renderSubGenres(genres) {
    return new Promise((resolve, reject) => {
        const carousel = $('#sub-genres');
        for (let genre of genres) {
            const a = `<a class="carousel-item" href="#${genre.name}!" data-id="${genre.id}"/>`
            const img = `<img src="${IMG_ROOT}/images/${genre.id}/240x160.jpg">`;
            const link = $(a);
            const text = `<h5 class="center-align">${genre.name}</h5>`;
            link.append($(text));
            link.append($(img));
            carousel.append(link);
        }
        resolve();
    });
}

async function getGenre(id) {
    const data = await fetchData(`${API_ROOT}/genres/${id}`);
    const genre = data.genres[0];
    genre.image = `${IMG_ROOT}/images/${id}/240x160.jpg`;
    console.debug('Got genre: %s', JSON.stringify(genre));
    return genre;
}

function createBreadcrumbsItem(val, idx, arr) {
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
    const parents = new URLSearchParams(query).getAll('parent').map(s => {
        const [id, name] = s.split('|');
        return { id, name }
    });
    console.debug('handling genre: %s, parents: %s', params.id, JSON.stringify(parents) );
    const genre = await getGenre(params.id);
    const hasChildren = genre.links['childGenres'];
    const history = [...parents];
    await renderTemplate('genre.html', {genre, hasChildren});
    if (hasChildren) {
        const children = await fetchData(genre.links.childGenres.href);
        await renderSubGenres(children.genres);
        $(document).on('click', '.carousel > .active', function() {
            const childId = $(this).data().id;
            const childQuery = history.map(p => `parent=${p.id}|${p.name}`).join('&');
            router.handle(`/genres/${childId}?${childQuery}`);
        });
        const carousel = document.querySelectorAll('.carousel');
        $('.carousel').carousel();
    }
    $('.tabs').tabs();
    history.push({id: genre.id, name: genre.name});
    const path = history.map( createBreadcrumbsItem );
    path.unshift({title: 'Genres', href: '/genres'});
    await renderTemplate('breadcrumbs.html', { path }, '#breadcrumbs');
});


$(document).ready(() => {
    M.AutoInit();
    //$('.tabs').tabs();
    //$('.sidenav').sidenav();
    router.handle('/genres');
})
