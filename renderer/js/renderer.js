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


router.addRoute('/genres', async (uri, params) => {
	await renderTemplate('genres.html');
	const ul = $('#genres-list');
	try {
		await fetchGenres( genre => {
			//console.debug('rendering %s', JSON.stringify(genre));
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
		});
		await renderTemplate('breadcrumbs.html', {
			path: [{ title: 'Genres', href: '/genres'}]
		}, '#breadcrumbs');
	} catch (err) {
		console.error(err);
	}
});

router.addRoute('/genres/:id', async (uri, params) => {
	const data = await fetchData(`/genres/${params.id}`);
	const genre = data.genres[0];
	genre.image = `${IMG_ROOT}/images/${genre.id}/240x160.jpg`;
	console.debug('Got genre: %s', JSON.stringify(genre));
	await renderTemplate('genre.html', {genre});
	$('.tabs').tabs();
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
