// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const sectionNames = ['Genres', 'Artists', 'Albums', 'Tracks', 'Stations'];
let currentSection = 'Genres';


window.ipc.on('set-section', (event, data) => {
	$('#section').html(data);
})


function loadSection(sectionName) {
    window.ipc.send('get-section', sectionName);
    //
    // const elem = $('#section');
    //
    // const navBar = document.getElementsByTagName('nav')[0];
    // const xPath = `//a[contains(text(),'${sectionName}')]`;
}


$(document).ready(() => {
    $('.sidenav').sidenav();
    loadSection(currentSection);
})
