<template>
  <div class="playlistWrapper">
    <playform style="position:fixed;z-index:5" />
    <confirmBox style="position:fixed;z-index:5" v-on:confirmation="decide" />

    <editform
      style="position:fixed;z-index:5"
      :index="targetListIndex"
      :playlist="targetList"
    />
    <div class="playlistCont">
      <div id="title" style="position:relative">
        Playlists
        <div @click="hidePlaylists" id="hidePlaylists">
          <img id src="@/assets/x.svg" alt />
        </div>
      </div>
      <div
        :key="playlist.id"
        v-for="(playlist, index) in playlists"
        class="playList"
      >
        <div class="playlist-name">
          <div class="pl-name">
            <p>{{ playlist.name }}</p>
            <div class="playListBt" @click="loadlist(index)">
              <img src="@/assets/triangle.svg" alt />
            </div>
          </div>
          <div class="options">
            <img
              src="@/assets/pen.png"
              @click="showEditBox(playlist, index)"
              alt
            />
            <img
              src="@/assets/trash.png"
              @click="showConfirmBox(playlist.name, index)"
              alt
            />
          </div>
        </div>
        <div class="playlist-Songs">
          <div :key="song.id" v-for="song in playlist.songs" class="songName">
            {{ song.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as electron from "electron";
import playform from "@/components/playlistForm.vue";
import editform from "@/components/editPlaylist.vue";
import confirmBox from "@/components/confirmBox.vue";

import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    playform,
    editform,
    confirmBox,
  },
  data() {
    return {
      targetListIndex: null,
      targetList: {
        name: "sampple list name",
        songs: [{ title: "sample song" }],
      },
    };
  },
  computed: mapGetters(["playlists"]),
  methods: {
    ...mapActions(["renderPlaylist", "loadPlaylistsFromFS", "deletePlaylist"]),
    hidePlaylists() {
      document.body.classList.remove("showPlaylistCont");
    },
    loadlist(playlistIndex) {
      this.renderPlaylist(playlistIndex);
      document.body.classList.add("showBackArrow");
    },
    showEditBox(playlist, index) {
      console.log(index);
      console.log(playlist);
      this.targetList = playlist;
      this.targetListIndex = index;
      document.body.classList.add("showEditForm");
    },
    showConfirmBox(name, index) {
      this.targetListIndex = index;
      document.body.classList.add("showConfirmer");
      document.querySelector(
        "#confirmText"
      ).textContent = `Delete the ${name} Playlist ?`;
    },
    decide(decision) {
      console.log(decision);
      if (decision === "Yes") {
        this.deletePlaylist(this.targetListIndex);
        setTimeout(() => {
          this.savePlaylistsToFS();
        }, 100);
      }
    },
    savePlaylistsToFS() {
      const json = JSON.stringify(this.playlists);
      electron.ipcRenderer.send("savePlaylists", json);
    },
  },
  mounted() {
    const playlistData = electron.ipcRenderer.sendSync("getPlaylists");
    const playlists = JSON.parse(playlistData);
    // console.log(playlists);
    if (playlistData == null) {
      console.log("no playlists");
    } else if (playlists.length < 1) {
      console.log("no playlist in file");
    } else {
      this.loadPlaylistsFromFS(playlists);
    }
  },
};
</script>

<style lang="scss">
#hidePlaylists {
  position: absolute;
  z-index: 3;
  right: -5px;
  top: 0px;
  transform: translateX(100%);
  background: rgba(255, 0, 0, 0.301);
  padding: 5px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#hidePlaylists:hover {
  cursor: pointer;
}
.playListEditBox {
  position: fixed;
  width: 500px;
  left: 50%;
  top: 10px;
  transform: translateX(50%);
  z-index: 5;
  button {
    padding: 5px;
    background: rgba(255, 0, 0, 0.274);
    color: white;
    font-size: 1.2em;
    font-weight: 500;
    border: none;
  }
}
.showPlaylistCont {
  .playlistCont {
    top: 10px;
  }
}

.playlistCont {
  position: absolute;
  z-index: 4;
  top: -810px;
  border-radius: 10px;
  width: 150px;
  background: linear-gradient(150deg, rgba(20, 20, 20, 0.452), rgb(32, 32, 32));
  padding-bottom: 8px;
  transition: 0.2s ease-in-out;
  #title {
    background: white;
    color: rgba(0, 0, 0, 0.863);
    font-weight: 800;
    font-size: 2em;
    text-align: center;
    border-radius: 10px 10px 0px 0px;
    margin-bottom: 5px;
  }
}
.playList {
  padding: 5px;
  font-size: 1.2em;
  position: relative;
  .playlist-name {
    border: 2px solid white;
    padding: 5px;
    padding-left: 10px;
    border-radius: 30px 0px 30px 30px;
    background: none;
    transition: 0.1s;
    position: relative;
    z-index: 6;
    .options {
      position: absolute;
      bottom: 0%;
      left: 5px;
      transform: translateY(60%);
      display: none;
      margin-left: -3px;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding-top: 30px;
      img {
        width: 30px;
        transition: 0.2s ease-in-out;
      }
    }
  }
  .playlist-name:hover {
    .options {
      display: flex;
      img:hover {
        transform: scale(1.15);
      }
    }
    // background: rgba(255, 255, 255, 0.534);
    // color: rgba(2, 45, 65, 0.863);
    cursor: pointer;
    font-weight: 600;
    border-color: orangered;
  }
  .playlist-Songs {
    width: 400px;
    background: rgb(20, 20, 20);
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 10px;
    transform: translateX(0%) scale(0);
    opacity: 0;
    transition: 0.3s ease-in-out;
    max-height: 500px;
    overflow-y: scroll;
    .songName {
      border-bottom: 2px solid rgba(95, 95, 95, 0.562);
      padding: 5px;
      padding-left: 10px;
      margin: 5px;
      transition: ease-in-out;
      color: rgb(255, 255, 255);
    }
  }
}
.playList:hover {
  margin-bottom: 30px;
  .playlist-Songs {
    opacity: 1;
    transform: translateX(110%) scale(1);
  }
}
.fixThePlaylist {
  .playlist-name {
    background: white;
    color: rgb(0, 85, 124);
    font-weight: 600;
  }
  .playlist-Songs {
    opacity: 1;
    transform: translateX(110%) scale(1);
  }
  .options {
    display: none;
  }
}
.pl-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .playListBt {
    transform: translateX(100%);
    background: rgb(255, 255, 255);
    border-radius: 20px;
    padding: 8px;
    position: absolute;
    right: 0%;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translate(100%, -60%);
    img {
      position: absolute;
      top: 50%;
      left: 60%;
      transform: translate(-50%, -50%);
      width: 20px;
    }
  }
  .playListBt:hover {
    filter: invert(100%);
    border: 2px solid rgb(0, 183, 255);
  }
}

#playList {
  width: 60px;
}
</style>
