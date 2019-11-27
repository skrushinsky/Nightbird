// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const sectionNames = ['Genres', 'Artists', 'Albums', 'Tracks', 'Stations'];
let currentSection = null;

nunjucks.configure('views', {
    autoescape: true
});

function loadTemplate(fileName, context) {
    return new Promise((resolve, reject) => {
        nunjucks.render(fileName, context, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}


function loadSection(sectionName, data) {
    const tmpl = `${sectionName.toLowerCase()}.html`;
    loadTemplate(tmpl, data).then(content => {
        $('#section').html(content);
    });
}


window.ipc.on('set-section', (event, sectionName, data) => {
    loadSection(sectionName, data);
})


$(document).ready(() => {
    $('.sidenav').sidenav();
    window.ipc.send('get-section', 'Genres');

})
