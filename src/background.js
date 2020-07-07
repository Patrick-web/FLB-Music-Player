"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import * as mm from "music-metadata";
import * as fs from "fs";
import * as path from "path";
import * as ffbinaries from "ffbinaries";
const ffmpeg = require("fluent-ffmpeg");
import { uuid } from "uuidv4";
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
const ffpths = path.join(appDataFolder, "ffPaths.json");
if (fs.existsSync(path.join(appDataFolder, "ffmpeg"))) {
  const pths = JSON.parse(fs.readFileSync(ffpths, "utf8"));
  ffmpeg.setFfmpegPath(pths.ffmpeg);
  ffmpeg.setFfprobePath(pths.ffprobe);
}
let processProgress;
let indexToConvert = 0;
let mixDuration;
const convertedSongs = [];
let win;

const isDevelopment = process.env.NODE_ENV !== "production";

init();

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
const defaultPoster = path.join(__static, "icon.png");
console.log(defaultPoster);
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    icon: path.join(__static, "icon.png"),
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.maximize();

  win.on("closed", () => {
    win = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

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

async function parseFile(file, scanDir) {
  let stat = fs.lstatSync(file);
  console.log(stat.isDirectory());
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
    console.log("Continuing to parse individuals");
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
  fs.writeFileSync(path.join(appDataFolder, fileName), content);
  event.returnValue = true;
});
ipcMain.on("getPreviouslyAdded", (event) => {
  const pth = path.join(appDataFolder, "flb_songs.json");
  if (fs.existsSync(pth)) {
    const prevAdded = fs.readFileSync(pth, "utf8");
    event.returnValue = prevAdded;
  } else {
    event.returnValue = false;
  }
});
ipcMain.on("savePlaylists", (event, json) => {
  const fileName = "flb_playlists.json";
  const content = json;
  fs.writeFileSync(path.join(appDataFolder, fileName), content);
  // event.returnValue = true;
});
ipcMain.on("saveRecentSongs", (event, json) => {
  const fileName = "flb_recents.json";
  const content = json;
  fs.writeFileSync(path.join(appDataFolder, fileName), content);
  // event.returnValue = true;
});

ipcMain.on("getPlaylists", (event) => {
  const pth = path.join(appDataFolder, "flb_playlists.json");
  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = [];
  }
});

ipcMain.on("getRecents", (event) => {
  const pth = path.join(appDataFolder, "flb_recents.json");
  if (fs.existsSync(pth)) {
    event.returnValue = fs.readFileSync(pth, "utf8");
  } else {
    event.returnValue = false;
  }
});

ipcMain.on("pickMusic", async (event) => {
  let files = dialog.showOpenDialog({
    title: "Add music",
    filters: [
      {
        name: "Sound (.mp3, .wav, .ogg, .m4a)",
      },
    ],
    properties: ["openDirectory"],
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
  });
  if (!files) {
    event.returnValue = [];
    return null;
  }

  let output = [];

  for (let file of files) {
    let arr = await parseFile(file, false);
    if (arr) output = [...arr];
  }
  event.returnValue = output;
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
  convertedSongs.length = 0;
  indexToConvert = songs.length - 1;
  if (fs.existsSync(ffpths)) {
    const fdata = analyseFormats(songs);
    if (fdata.notSame) {
      console.log("Converting first");
      convertToMp3(songs, event);
    } else {
      console.log("All same format thus\n Merging...");
      merge(songs, event);
    }
  } else {
    win.webContents.send("promptInternet");
    console.log("Telling user to turn on internet");
  }
});

ipcMain.on("convertVideoToMp3", async (event, videoPath) => {
  const filename = videoPath
    .replace(/^.*[\\\/]/, "")
    .replace(/\.[0-9a-z]+$/i, "");
  const output = path.join(toMp3Dir, `${filename}.mp3`);
  convertVideoToMp3(videoPath, output, event, filename);
});

ipcMain.on("getProgress", (event) => {
  console.log("Getting progress");
  sendProgress(event);
});
ipcMain.on("downloadBinaries", () => {
  console.log("Deciding on bins");
  console.log(fs.existsSync(path.join(appDataFolder, "ffPaths.json")));
  if (!fs.existsSync(path.join(appDataFolder, "ffPaths.json"))) {
    getBinaries();
  }
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
function convertToTimestamp(string) {
  let hours = parseInt(string.substr(1, 2));
  let minutes = parseInt(string.substr(4, 2));
  let seconds = parseInt(string.substr(7, 4));
  let timestamp = hours * 60 * 60 + minutes * 60 + seconds;
  return Math.floor(timestamp);
}

function merge(songs, event) {
  console.log(songs);
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
      let currentTime = convertToTimestamp(JSON.stringify(progress.timemark));
      const percent = (currentTime * 100) / mixDuration;
      win.webContents.send("progress", Math.floor(percent));
    })
    .on("end", async () => {
      console.log("Merging finished !");
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
  console.log(input);
  ffmpeg(input)
    .toFormat("mp3")
    .on("start", () => {
      const stats = fs.statSync(input);
      const fileSizeInBytes = stats["size"];
      console.log("Input size is " + fileSizeInBytes);
      console.log("Starting conversion");
    })
    .on("error", (err) => {
      console.log("An error occurred: " + err.message);
      win.webContents.send("conversionError", err.message);
    })
    .on("progress", (progress) => {
      // console.log(JSON.stringify(progress));
      // console.log("Conveting: " + progress.targetSize + " KB converted");
      processProgress = progress.targetSize;
      console.log(progress);
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
      // const fNames = [
      //   "flb_recents.json",
      //   "flb_songs.json",
      //   "flb_playlists.json",
      // ];
      // const content = "";
      // fNames.forEach((file) => {
      //   fs.writeFileSync(path.join(appDataFolder, file), content);
      // });
    }
  });
}

mkNecessaryDirs();

async function saveMix(tags, event) {
  const mp3Tags = tags;
  mp3Tags.APIC = defaultPoster;
  let file = path.join(appDataFolder, "fmixed.mp3");
  let success = NodeID3.write(mp3Tags, file);
  console.log(success);
  if (success) {
    (async () => {
      console.log(tags.title);
      const outputPath = path.join(mixesDir, `${tags.title}.mp3`);
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

function init() {
  console.log(ffpths);
  fs.access(ffpths, fs.F_OK, (err) => {
    if (err) {
      console.log("Binaries DO NOT EXIST");
      getBinaries();
    } else {
      console.log("Binaries EXIST");
      const paths = JSON.parse(fs.readFileSync(ffpths, "utf8"));
      ffmpeg.setFfmpegPath = paths.ffmpeg;
      ffmpeg.setFfprobePath = paths.ffprobe;
      console.log(paths.ffmpeg);
    }

    //file exists
  });
}
function getBinaries() {
  var platform = ffbinaries.detectPlatform();

  return ffbinaries.downloadFiles(
    ["ffmpeg", "ffprobe"],
    { platform: platform, quiet: true, destination: appDataFolder },
    function(err, data) {
      console.log("Downloading binaries for " + platform + ":");
      console.log("err", err);
      console.log("The data from downloading bins is ", data);
      saveBinaryPaths(err, data);
    }
  );
}
function saveBinaryPaths(err, data) {
  if (err) {
    console.log("Downloads failed.");
  } else {
    const fileName = "ffPaths.json";
    const ffmpegPath = path.join(appDataFolder, "ffmpeg");
    const ffprobePath = path.join(appDataFolder, "ffprobe");

    const content = {
      ffmpeg: ffmpegPath,
      ffprobe: ffprobePath,
    };
    fs.writeFileSync(
      path.join(appDataFolder, fileName),
      JSON.stringify(content)
    );
    console.log("Downloads successful.");

    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);
  }
}
