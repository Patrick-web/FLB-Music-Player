"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import * as mm from "music-metadata";
import * as dataUrl from "dataurl";
import * as mimeTypes from "mime-types";
import * as fs from "fs";
import * as path from "path";
const os = require("os");
import * as ffbinaries from "ffbinaries";
const ffmpeg = require("fluent-ffmpeg");
import { uuid } from "uuidv4";
import { format } from "util";
const moveFile = require("move-file");
const NodeID3 = require("node-id3");

const appDataFolder = app.getPath("userData");
const musicDir = app.getPath("music");
const toMp3Dir = path.join(musicDir, "FLBtoMp3");
const videosDir = app.getPath("videos");
const convertedDir = path.join(appDataFolder, "converted");
const lyricsDir = path.join(appDataFolder, "lyrics");
const mixesDir = path.join(musicDir, "flbMixes");
const lyricVids = path.join(videosDir, "flbLyricVideos");
const pth = path.join(appDataFolder, "ffPaths.json");
const paths = JSON.parse(fs.readFileSync(pth, "utf8"));
ffmpeg.setFfmpegPath(paths.ffmpeg);
ffmpeg.setFfprobePath(paths.ffprobe);
const defaultPoster = path.join(__dirname, "../src/assets/poster.png");

let mergeEvent;
let processProgress;
let indexToConvert = 0;
let mixDuration;
const convertedSongs = [];

function getBinaries(callback) {
  var platform = ffbinaries.detectPlatform();

  return ffbinaries.downloadFiles(
    ["ffmpeg", "ffprobe"],
    { platform: platform, quiet: true, destination: os.homedir() },
    function(err, data) {
      console.log("Downloading binaries for " + platform + ":");
      console.log("err", err);
      //   console.log('data', data);
      return callback(err, data);
    }
  );
}

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    autoHideMenuBar: true,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  win.maximize();

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// ipcMain.on("loadMusic", (e) => {
//   console.log("laodding sound");
// });

// function readSound(location) {
//   const pm = new Promise((resolve, reject) => {
//     fs.readFile(location, (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       console.log(data);
//       resolve(dataUrl.convert({ data, mimetype: mimeTypes.lookup(location) }));
//     });
//   });

//   return pm;
// }

// ipcMain.on("readSound", (event, location) => {
//   readSound(location).then((url) => {
//     event.sender.send("soundLoaded", url);
//   });
// });

// ipcMain.on("readFile", (event, name) => {
//   const userData = app.getPath("userData");
//   const pth = path.join(userData, name);

//   if (fs.existsSync(pth)) {
//     event.returnValue = fs.readFileSync(pth, "utf8");
//   } else {
//     event.returnValue = null;
//   }
// });

async function parseFile(file, scanDir) {
  let stat = fs.lstatSync(file);

  if (stat.isDirectory()) {
    if (!scanDir) return;

    let files = fs.readdirSync(file);
    let output = [];

    for (let child of files) {
      let p = await parseFile(path.join(file, child));
      if (p) output.push(p[0]);
    }
    // console.log(output[1].tags.format);

    return output;
  } else {
    let ext = path.extname(file);
    if (ext != ".mp3" && ext != ".ogg" && ext != ".wav" && ext != ".m4a")
      return;

    let out = {
      date: stat.ctimeMs,
      extension: ext,
      location: file,
      name: path
        .basename(file)
        .split(".")
        .slice(0, -1)
        .join("."),
    };

    if (ext == ".mp3" || ext == ".m4a") {
      out.tags = await mm.parseFile(file, { native: true });
    }

    return [out];
  }
}

ipcMain.on("saveAddedSongs", (event, json) => {
  const fileName = "flb_songs.json";
  const content = json;
  const userData = app.getPath("userData");
  fs.writeFileSync(path.join(userData, fileName), content);
  event.returnValue = true;
});
ipcMain.on("savePlaylists", (event, json) => {
  const fileName = "flb_playlists.json";
  const content = json;
  const userData = app.getPath("userData");
  fs.writeFileSync(path.join(userData, fileName), content);
  // event.returnValue = true;
});
ipcMain.on("saveRecentSongs", (event, json) => {
  const fileName = "flb_recents.json";
  const content = json;
  const userData = app.getPath("userData");
  fs.writeFileSync(path.join(userData, fileName), content);
  // event.returnValue = true;
});

ipcMain.on("getSongs", (event) => {
  const userData = app.getPath("userData");
  const pth = path.join(userData, "flb_songs.json");
  // console.log(pth);
  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = null;
  }
});

ipcMain.on("getPlaylists", (event) => {
  const userData = app.getPath("userData");
  const pth = path.join(userData, "flb_playlists.json");
  // console.log(pth);
  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = null;
  }
});

ipcMain.on("getRecents", (event) => {
  const userData = app.getPath("userData");
  const pth = path.join(userData, "flb_recents.json");
  // console.log(pth);
  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = null;
  }
});

ipcMain.on("pickMusic", async (event) => {
  let files = dialog.showOpenDialog({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
        //  extensions: ["mp3", "wav", "ogg","mp3"]
      },
    ],
    properties: ["openDirectory"],
    // properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
  });

  if (!files) {
    event.returnValue = [];
    return null;
  }

  let output = [];

  for (let file of files) {
    let arr = await parseFile(file, true);
    if (arr) output = output.concat(arr);
  }

  event.returnValue = output;
});

ipcMain.on("pickSongs", async (event) => {
  let files = dialog.showOpenDialog({
    title: "Add songs",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
        extensions: ["mp3", "wav", "ogg", "m4a"],
      },
    ],
    properties: ["multiSelections", "openFile"],
    // properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
  });

  if (!files) {
    event.returnValue = [];
    return null;
  }

  let output = [];

  for (let file of files) {
    let arr = await parseFile(file, false);
    if (arr) output = output.concat(arr);
  }

  event.returnValue = output;
});

ipcMain.on("pickPicture", async (event) => {
  let files = dialog.showOpenDialog({
    title: "Select Picture",
    filters: [
      {
        name: "Image (.jpeg, .png, .jpg)",
        extensions: ["jpeg", "png", "jpg"],
      },
    ],
    properties: ["openFile"],
    // properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
  });

  if (!files) {
    event.returnValue = false;
    return null;
  } else {
    console.log(files[0]);
    event.returnValue = files[0];
  }
});

ipcMain.on("pickVideo", async (event) => {
  let files = dialog.showOpenDialog({
    title: "Select Video",
    filters: [
      {
        name: "Video (.mp4, .mkv,.webm,.avi)",
        extensions: ["avi", "mp4", "mkv", "webm"],
      },
    ],
    properties: ["openFile"],
  });

  if (!files) {
    event.returnValue = false;
    return;
  } else {
    event.returnValue = files[0];
  }
});

ipcMain.on("saveMix", async (event, tags) => {
  saveMix(tags, event);
});

ipcMain.on("mixSongs", async (event, songs) => {
  mergeEvent = event;
  convertedSongs.length = 0;
  indexToConvert = songs.length - 1;
  if (fs.existsSync(pth)) {
    const fdata = analyseFormats(songs);
    if (fdata.notSame) {
      console.log("Converting first");
      convertToMp3(songs, event);
    } else {
      console.log("All same format thus\n Merging...");
      merge(songs, event);
    }
  } else {
    /* tell user to turn on internet connnetion
in order to download ffmpeg and this provide a button that
executes the below function
*/
    getBinaries(function(err, data) {
      if (err) {
        console.log("Downloads failed.");
      } else {
        const fileName = "ffPaths.json";
        const content = {
          ffmpeg: data[0].path + "/ffmpeg",
          ffprobe: data[1].path + "/ffprobe",
        };
        const userData = app.getPath("userData");
        console.log(JSON.stringify(content));
        fs.writeFileSync(
          path.join(userData, fileName),
          JSON.stringify(content)
        );
        console.log("Downloads successful.");
      }
    });

    event.returnValue = null;
  }
});

ipcMain.on("convertVideoToMp3", async (event, videoPath) => {
  const filename = videoPath
    .replace(/^.*[\\\/]/, "")
    .replace(/\.[0-9a-z]+$/i, "");
  const output = path.join(toMp3Dir, filename);

  convertVideoToMp3(videoPath, output, event, filename);
});

ipcMain.on("getProgress", (event) => {
  console.log("Getting progress");
  sendProgress(event);
});

async function getTotalDurationOfMix(songs) {
  let totalDuration = 0;
  for await (const song of songs) {
    let songData = await mm.parseFile(song);
    console.log(songData.format.duration);
    totalDuration += songData.format.duration;
  }
  mixDuration = Math.floor(totalDuration);
}
function getTimestampFormat(string) {
  let hours = parseInt(string.substr(1, 2));
  let minutes = parseInt(string.substr(4, 2));
  let seconds = parseInt(string.substr(7, 4));
  let timestamp = hours * 60 * 60 + minutes * 60 + seconds;
  return Math.floor(timestamp);
}

function merge(songs, event) {
  if (!songs) {
    event.returnValue = false;
  } else {
    getTotalDurationOfMix(songs);
    const command = ffmpeg();

    songs.forEach((song) => {
      command.input(song);
    });
    console.log("Merger started");
    command
      .on("start", function(data) {
        console.log("start data is  " + data);
      })
      .on("error", function(err) {
        console.log("An error occurred: " + err.message);
        win.webContents.send("mixingError");
      })
      .on("progress", (progress) => {
        console.log("Merging...");
        let currentTime = getTimestampFormat(JSON.stringify(progress.timemark));
        console.log(mixDuration);
        console.log(currentTime);
        const percent = (currentTime * 100) / mixDuration;
        // console.log(percent);
        win.webContents.send("progress", Math.floor(percent));
      })
      .on("end", async () => {
        console.log("Merging finished !");
        console.log("Event is " + mergeEvent);
        const tempMix = await mm.parseFile(`${appDataFolder}/fmixed.mp3`, {
          native: true,
        });
        win.webContents.send("draftMixSaved", {
          mixData: tempMix,
          mixPath: `${appDataFolder}/fmixed.mp3`,
        });
        cleanUp();
      })
      .mergeToFile(`${appDataFolder}/fmixed.mp3`, appDataFolder);
  }
}

function convertToMp3(songs) {
  if (indexToConvert === -1) {
    return merge(convertedSongs);
  }
  let track = songs[indexToConvert]; //your path to source file
  const id = uuid();
  const savePath = `${appDataFolder}/converted/${id}.mp3`;
  console.log("Intial path " + id);
  let format = track.match(/\..+/g)[0];
  console.log(track.match(/\..+/g));
  if (format !== ".mp3" && format !== ".m4a") {
    console.log("Converting " + track);
    try {
      ffmpeg(track)
        .toFormat("mp3")
        .on("error", (err) => {
          console.log("An error occurred: " + err.message);
        })
        .on("progress", (progress) => {
          // console.log(JSON.stringify(progress));
          console.log("Processing: " + progress.targetSize + " KB converted");
        })
        .on("end", () => {
          console.log("Processing finished !");
          convertedSongs.unshift(savePath);
          console.log("Pushed path " + id);
          indexToConvert -= 1;
          convertToMp3(songs);
        })
        .save(savePath); //path where you want to save your file
    } catch (error) {
      console.log("Error in converting");
      return merge(false);
    }
  } else {
    console.log(format + " " + track + " addded");
    convertedSongs.push(track);
    console.log("Pushed path " + track);
    indexToConvert -= 1;
    convertToMp3(songs);
  }
}

async function convertVideoToMp3(input, output, event, songTitle) {
  ffmpeg(input)
    .toFormat("mp3")
    .on("start", () => {
      console.log("Starting conversion");
    })
    .on("error", (err) => {
      console.log("An error occurred: " + err.message);
      win.webContents.send("conversionError", err.message);
    })
    .on("progress", (progress) => {
      // console.log(JSON.stringify(progress));
      console.log("Conveting: " + progress.targetSize + " KB converted");
      processProgress = progress.targetSize;
      win.webContents.send("progress", Math.floor(progress.percent));
    })
    .on("end", async () => {
      console.log("conversion to mp3 finished !");
      const mp3Data = await mm.parseFile(output, {
        native: true,
      });
      console.log(mp3Data);
      let data = {
        id: uuid(),
        title: songTitle,
        path: output,
        duration: mp3Data.format.duration,
      };
      win.webContents.send("convertedSong", data);
    })
    .save(output);
}

function analyseFormats(songs) {
  const formats = songs.map((song) => song.match(/\..+/g)[0]);
  console.log(formats);
  const sameFormat = formats.some((format) => format !== formats[0]);
  console.log("Is not same format " + sameFormat);
  const data = {
    notSame: sameFormat,
    format: songs[0].match(/\..+/g)[0],
  };
  return data;
}

function mkNecessaryDirs() {
  const dirs = [toMp3Dir, convertedDir, lyricsDir, mixesDir, lyricVids];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log(dir + " successfully created.");
        }
      });
    } else {
      console.log(dir + " EXISTS");
    }
  });
  console.log();
}

mkNecessaryDirs();

async function saveMix(tags, event) {
  let file = path.join(appDataFolder, "fmixed.mp3");
  console.log(tags);
  if (!tags.APIC) tags.APIC = defaultPoster;
  console.log(tags);
  let success = NodeID3.write(tags, file);
  console.log(success);
  if (success) {
    (async () => {
      console.log(tags.title);
      const outputPath = path.join(mixesDir, tags.title);
      await moveFile(file, outputPath);
      const savedMix = await mm.parseFile(outputPath);
      const mixData = {
        id: uuid(),
        title: savedMix.common.title,
        path: outputPath,
        duration: savedMix.format.duration,
      };
      console.log("The file has been moved");
      console.log(mixData);
      win.webContents.send("mixSaved", mixData);
    })();
  } else {
    win.webContents.send("mixSaveError");
  }
}

function cleanUp() {
  const directory = convertedDir;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

function sendProgress(event) {
  console.log("Progress pinged");
  event.returnValue = processProgress;
}
