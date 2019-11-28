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
	autoescape: true
});


function renderTemplate(fileName, context) {
	console.debug('Rendering template %s', fileName);
	nunjucks.render(fileName, context, (err, res) => {
		if (err) {
			console.error('Error rendering template: %s', err);
		} else {
			$('#section').html(res);
		}
	});
}

ipcRenderer.on('set-section', (event, sectionName, data) => {
	console.debug('set-section event');
  console.log('Got data: %s', data);
  const genres = JSON.parse(data);
	//console.log('Got data: %s', JSON.stringify(genres, null, '  '));
	renderTemplate(`${sectionName.toLowerCase()}.html`, genres);
});

ipcRenderer.on('show-error', (event, err) => {
	console.debug('show-error event');
	console.log('Error: %s', JSON.stringify(err, null, '  '));
	renderTemplate('error.html', {
		message: err
	});

});



$(document).ready(() => {
	$('.sidenav').sidenav();
	ipcRenderer.send('get-section', 'Genres');

})
