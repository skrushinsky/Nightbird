// Modules to control application life and create native browser window
const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron');
const path = require('path');
const appTitle = "Nightbird";
const { fetchGenres } = require('./main/sections');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		show: false,
		title: appTitle,
		backgroundColor: '#FFF',
		width: 1200,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'main', 'preload.js'),
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile('renderer/index.html');

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
	console.log('locale: %s', app.getLocale());
	mainWindow.show();
	mainWindow.focus();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function() {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('get-section', (event, sectionName) => {
	let handler;
	switch (sectionName) {
		case 'Genres':
		  handler = fetchGenres;
      break;
		default:
			throw `Unknown section: "${sectionName}"`;
	}
  handler().then( res => {
    //console.log('Got result: %s', JSON.stringify(res, null, '  ') );
    event.sender.send('set-section', sectionName, JSON.stringify(res));
  }).catch( err => {
    console.log(err);
    event.sender.send('show-error', err);
  });

	// try {
	// 	const data = await fetchGenres();
	// 	event.sender.send('set-section', sectionName, null, data);
	// } catch (err) {
	// 	console.log(err);
	// 	event.sender.send('set-section', sectionName, err, null);
	// }
})
