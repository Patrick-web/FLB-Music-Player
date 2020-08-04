const fs = require("fs");
import * as mm from "music-metadata";
import * as path from "path";

export async function parseFile(file, scanDir) {
  let stat = fs.lstatSync(file);
  if (stat.isDirectory()) {
    if (!scanDir) return;

    let files = fs.readdirSync(file);
    let output = [];

    for (let child of files) {
      let p = await parseFile(path.join(file, child));
      if (p) output.push(p[0]);
    }

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
