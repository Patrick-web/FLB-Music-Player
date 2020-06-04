'use strict'

import { app, protocol, BrowserWindow,ipcMain,dialog } from 'electron'
import { createProtocol,installVueDevtools} from 'vue-cli-plugin-electron-builder/lib'
import * as mm from "music-metadata";
import * as dataUrl from "dataurl";
import * as mimeTypes from "mime-types";
import * as fs from 'fs'
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, webPreferences: {
	nodeIntegration: true,
	webSecurity:false
  } })
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.maximize()
//   console.log(win);
  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
  await installVueDevtools()
} catch (e) {
  console.error('Vue Devtools failed to install:', e.toString())
}

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('loadMusic',(e)=>{
  console.log("laodding sound")
})


function readSound(location) {
	const pm = new Promise((resolve, reject) => {
		fs.readFile(location, (err, data) => {
			if (err) {reject(err);}
			console.log(data);
			resolve(dataUrl.convert({data, mimetype: mimeTypes.lookup(location)}));
		});
	});

	return pm;
}

ipcMain.on("readSound", (event, location) => {
	readSound(location)
		.then((url) => {
			event.sender.send("soundLoaded", url);
		});
});

ipcMain.on("readFile", (event, name) => {
	const userData = app.getPath('userData');
	const pth = path.join(userData, name);

	if (fs.existsSync(pth)) {
		event.returnValue = fs.readFileSync(pth, "utf8");
	}else{
		event.returnValue = null;
	}
});

// ipcMain.on("writeFile", (event, name, data) => {
// 	if (typeof data != "string") {
// 		event.returnValue = false;
// 		return;
// 	}

// 	const userData = app.getPath('userData');
// 	fs.writeFileSync(path.join(userData, name), data);

// 	event.returnValue = true;
// });

async function parseFile(file, scanDir) {
	let stat = fs.lstatSync(file);

	if (stat.isDirectory()) {
		if (!scanDir)
			return;

		let files = fs.readdirSync(file);
		let output = [];

		for (let child of files) {
			let p = (await parseFile(path.join(file, child)));
			if (p)
				output.push(p[0]);
		}
		// console.log(output[1].tags.format);
		
		return output;
	}else{
		let ext = path.extname(file);
		if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".m4a")
			return;
			
		let out = {date: stat.ctimeMs, extension: ext, location: file, name: path.basename(file).split('.').slice(0, -1).join('.')};

		if (ext == ".mp3" || ext == ".m4a") {
			out.tags = await mm.parseFile(file, {native: true});
    }

		return [out];
	}
}

ipcMain.on('saveAddedSongs',(event,json)=>{
	const fileName ='flb_songs.json'
	const content = json;
	const userData = app.getPath('userData');
	fs.writeFileSync(path.join(userData, fileName), content);
	event.returnValue = true;
})
ipcMain.on('savePlaylists',(event,json)=>{
	const fileName ='flb_playlists.json'
	const content = json;
	const userData = app.getPath('userData');
	fs.writeFileSync(path.join(userData, fileName), content);
	// event.returnValue = true;
})
ipcMain.on('saveRecentSongs',(event,json)=>{
	const fileName ='flb_recents.json'
	const content = json;
	const userData = app.getPath('userData');
	fs.writeFileSync(path.join(userData, fileName), content);
	// event.returnValue = true;
})

ipcMain.on("getSongs", (event) => {
	const userData = app.getPath('userData');
	const pth = path.join(userData, 'flb_songs.json');
	// console.log(pth);
	if (fs.existsSync(pth)) {
		event.returnValue = fs.readFileSync(pth, "utf8");
	}else{
		event.returnValue = null;
	}
});

ipcMain.on("getPlaylists", (event) => {
	const userData = app.getPath('userData');
	const pth = path.join(userData, 'flb_playlists.json');
	// console.log(pth);
	if (fs.existsSync(pth)) {
		event.returnValue = fs.readFileSync(pth, "utf8");
	}else{
		event.returnValue = null;
	}
});

ipcMain.on("getRecents", (event) => {
	const userData = app.getPath('userData');
	const pth = path.join(userData, 'flb_recents.json');
	// console.log(pth);
	if (fs.existsSync(pth)) {
		event.returnValue = fs.readFileSync(pth, "utf8");
	}else{
		event.returnValue = null;
	}
});


ipcMain.on("pickMusic", async (event, folder) => {
	let files = dialog.showOpenDialog({
		title: "Add music",
		filters: [
			{name: "Sound (.mp3, .wav, .ogg, .m4a)",
			//  extensions: ["mp3", "wav", "ogg","m4a"]
			}
		],
		properties: ["openDirectory"]
		// properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
	});

	if (!files) {
		event.returnValue = [];
		return null;
	}

	let output = [];

	for (let file of files) {
		let arr = await parseFile(file, true);
		if (arr)
			output = output.concat(arr);
	}

	event.returnValue = output;
});

ipcMain.on("pickSongs", async (event) => {
	let files = dialog.showOpenDialog({
		title: "Add songs",
		filters: [
			{name: "Sound (.mp3, .wav, .ogg, .m4a)",
			 extensions: ["mp3", "wav", "ogg","m4a"]
			}
		],
		properties: ["multiSelections","openFile"]
		// properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
	});

	if (!files) {
		event.returnValue = [];
		return null;
	}

	let output = [];

	for (let file of files) {
		let arr = await parseFile(file, false);
		if (arr)
			output = output.concat(arr);
	}

	event.returnValue = output;
});