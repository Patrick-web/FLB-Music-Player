<template>
  <div class="menu">
    <div class="menuShow"></div>
    <div @click="renderRecents" id="recent" class="icn">
      <img src="@/assets/clock.png" alt="" />
      <p style="width:150px" class="exp">Recently Played</p>
    </div>
    <div @click="showPlaylists" id="fav" class="icn">
      <img src="@/assets/favourite.svg" alt="" />
      <p style="width:90px" class="exp">Playlists</p>
    </div>
    <div v-on:click="pickMusic(true)" id="folder" class="icn">
      <img src="@/assets/folder.png" alt="" />
      <p class="exp" style="width:160px">Add Music folder</p>
    </div>
    <div v-on:click="pickSongs(true)" id="musicPlus" class="icn">
      <img src="@/assets/musicPlus.svg" alt="" />
      <p class="exp" style="background:#00FF8C">Add Songs</p>
    </div>
  </div>
</template>

<script>
import { uuid } from "uuidv4";
import * as electron from "electron";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      songs: [],
    };
  },
  computed: mapGetters(["addedSongs"]),
  methods: {
    ...mapActions([
      "persistFolderSongs",
      "renderSongsFromFolder",
      "renderRecents",
    ]),
    showPlaylists() {
      document.body.classList.toggle("showPlaylistCont");
    },
    pickMusic(folder) {
      document.body.classList.add("loadingNow");
      document.querySelector("#loadingImg").classList.add("jello");
      setTimeout(() => {
        let data = electron.ipcRenderer.sendSync("pickMusic", folder);

        for (let file of data) {
          this.songs.push(file);
        }
        // this.setPoster(this.songs[1].tags.common.picture[0]);
        this.extractInfo(this.songs);
      }, 200);
    },
    pickSongs() {
      document.body.classList.add("loadingNow");
      document.querySelector("#loadingImg").classList.add("jello");
      setTimeout(() => {
        let data = electron.ipcRenderer.sendSync("pickSongs");

        for (let file of data) {
          this.songs.push(file);
        }
        // this.setPoster(this.songs[1].tags.common.picture[0]);
        this.extractInfo(this.songs);
      }, 200);
    },
    extractInfo(data) {
      let songs = [];
      data.forEach((item) => {
        let poster;
        let duration;
        // if(item.tags)
        if (item.tags == undefined || item.tags.common.picture == undefined) {
          poster = false;
          duration = 0;
        } else {
          poster = item.tags.common.picture[0];
          duration = Math.floor(item.tags.format.duration);
        }
        const song = {
          id: uuid(),
          title: item.name,
          poster: this.setPoster(poster),
          path: item.location,
          duration: duration,
        };
        songs.push(song);
      });
      if (songs.length > 0) {
        this.persistFolderSongs(songs);
        this.renderSongsFromFolder();
        document.querySelector("#playingType").textContent = "Added";
      }
      document.body.classList.remove("loadingNow");
      document.querySelector("#loadingImg").classList.remove("jello");

      // this.$emit('renderSongsFromFolder',songs);
      this.saveFolderSongsToJson(songs);
    },
    saveFolderSongsToJson(songs) {
      console.log("Remembering");
      const json = JSON.stringify(this.addedSongs);
      const isSaved = electron.ipcRenderer.sendSync("saveAddedSongs", json);
      console.log(isSaved);
    },
    setPoster(arg) {
      if (arg === false) {
        return "/img/poster.e5b0f5a2.png";
      } else {
        const format = arg.format;
        const pictureBuffer = arg.data;
        const base64String = this._arrayBufferToBase64(pictureBuffer);
        const imageurl = `data:${format};base64,` + base64String;
        return imageurl;
      }
    },
    _arrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
  },
};
</script>

<style lang="scss">
.menu {
  position: fixed;
  top: 50%;
  left: 0%;
  height: 100vh;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.menuShow {
  position: fixed;
  opacity: 0.4;
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  height: 250px;
  width: 8px;
  border-radius: 0px 20px 20px 0px;
  background: linear-gradient(rgba(0, 89, 255, 0.993), rgb(0, 255, 242));
  filter: blur(8px);
}
.icn {
  margin: 20px;
  z-index: 4;
  position: relative;
  img {
    width: 80%;
  }
  .exp {
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(80%, -50%);
    color: black;
    padding: 5px;
    font-size: 20px;
    border-radius: 20px;
    opacity: 0;
    transition: 0.1s ease-in;
    width: 100px;
    padding-left: 10px;
    pointer-events: none;
  }
}
.icn:hover {
  cursor: pointer;
  filter: invert(100%);
  .exp {
    transform: translate(100%, -50%);
    opacity: 1;
  }
}

#recent {
  p {
    background: orange;
  }
}
#fav {
  p {
    background: rgb(6, 175, 147);
  }
}
#folder {
  p {
    color: white;
    background: purple;
  }
}
</style>
