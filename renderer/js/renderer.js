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


ipcRenderer.on('show-error', (event, err) => {
    console.debug('show-error event');
    console.log('Error: %s', JSON.stringify(err, null, '  '));
    renderTemplate('error.html', { message: err });
});


ipcRenderer.on('set-url', (event, url) => {
	console.log('set-url event, %s', url);
	router.handle(url);
});


ipcRenderer.on('set-genres', (event, data) => {
	console.log('set-genres event');
	const genres = JSON.parse(data);
	console.log('Got %d genres', genres.length);
	const ul = $('#genres-list');
	for(let genre of genres) {
		const li = $('<li class="collection-item avatar"/>');
		const img = `<img src="${genre.image}" alt="" class="circle"/>`;
		li.append($(img));
		const span = $('<span class="title"/>');
		const a = `<a href="/genres/${genre.id}">${genre.name}</a>`;
		span.append($(a));
		li.append(span);
		const p = `<p>${genre.description}</p>`;
		li.append($(p));
		ul.append(li);
	}
});

router.addRoute('/genres', (uri, params) => {
	renderTemplate('genres.html').then(
		fetch()
	).then( () => {
		renderTemplate('breadcrumbs.html', {
	        path: [{ title: 'Genres', href: '/genres'}]
	    }, '#breadcrumbs');
	}).catch( err => consolo.error(err));
});

router.addRoute('/genres/:id', (uri, params) => {
	// renderTemplate('genre.html').then(
	// 	() => ipcRenderer.send('get-genre', params.id)
	// ).then( (genre) => {
	// 	renderTemplate('breadcrumbs.html', {
	//         path: [
	// 			{ title: 'Genres', href: '/genres'},
	// 			{ title: genre.name, href: `/genres/${genre.id}`},
	// 		]
	//     }, '#breadcrumbs');
	// }).catch( err => consolo.error(err));
});


$(document).ready(() => {
    $('.sidenav').sidenav();
	router.handle('/genres');
})
