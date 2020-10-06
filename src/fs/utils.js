import { app } from "electron";
const fs = require("fs");
const appDataFolder = app.getPath("userData");

export function getBinaries() {
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
export function exists(path) {
  return fs.existsSync(path);
}
