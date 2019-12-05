// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const sectionNames = ['Genres', 'Artists', 'Albums', 'Tracks', 'Stations'];
let currentSection = null;
const ipcRenderer = window.ipcRenderer;

nunjucks.configure('views', { autoescape: false });

function renderTemplate(fileName, context, section = '#main') {
    console.debug('Rendering template %s', fileName);
	return new Promise( (resolve, reject) => {
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
    return new Promise(  (resolve, reject) => {
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

function renderSubGenres(parentId, genres) {
    return new Promise(  (resolve, reject) => {
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

router.addRoute('/genres', async (uri, params) => {
	await renderTemplate('genres.html');
	try {
		const genres = await fetchGenres();
        const li = await renderGenres(genres);
		await renderTemplate('breadcrumbs.html', {
			path: [{ title: 'Genres', href: '/genres'}]
		}, '#breadcrumbs');
	} catch (err) {
		console.error(err);
	}
});


router.addRoute('/genres/:id', async (uri, params) => {
	const data = await fetchData(`${API_ROOT}/genres/${params.id}`);
	const genre = data.genres[0];
	genre.image = `${IMG_ROOT}/images/${genre.id}/240x160.jpg`;
	console.debug('Got genre: %s', JSON.stringify(genre));
	await renderTemplate('genre.html', {genre});
    const children = await fetchData(genre.links.childGenres.href);
    await renderSubGenres(genre.id, children.genres);
	$('.tabs').tabs();
    $('.carousel').carousel();
    $('.carousel > .active').click( () => {
        const genreId = $(this).data();
        console.log('Clicked, id=%s', genreId);
        console.log($(this).data());
    });
    const carousel = document.querySelectorAll('.carousel');
    // M.Carousel.init(carousel, {
    //     //numVisible: 8,
    //     indicators: true
    // });
	renderTemplate('breadcrumbs.html', {
        path: [
			{ title: 'Genres', href: '/genres'},
			{ title: genre.name, href: `/genres/${genre.id}`},
		]
    }, '#breadcrumbs');
});


$(document).ready(() => {
	M.AutoInit();
	//$('.tabs').tabs();
    //$('.sidenav').sidenav();
	router.handle('/genres');
})
