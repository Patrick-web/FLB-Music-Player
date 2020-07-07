<template>
  <div class="form playlistAdder">
    <label for>Enter playlist name</label>
    <input id="newPlaylist" class="inputElem" type="text" />
    <p
      class="formBtn"
      style="width: 240px;margin-bottom:10px"
      @click="createAndAdd"
    >
      Create & Add
    </p>
    <p
      class="formBtn"
      style="background: rgb(255, 0, 119);width: 240px;margin-bottom:10px"
      @click="hideForm"
    >
      Cancel
    </p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as electron from "electron";

export default {
  computed: mapGetters(["playlists"]),
  methods: {
    ...mapActions(["addNewPlaylist"]),
    hideForm() {
      document.body.classList.remove("showPlaylistAdder");
      document.querySelector("#newPlaylist").value = "";
    },
    createAndAdd() {
      const newPlaylistName = document.querySelector("#newPlaylist");
      const songToAdd = window.currentSong;
      const newPlaylist = {
        name: newPlaylistName.value,
        id: Date.now(),
        songs: [songToAdd],
      };
      this.addNewPlaylist(newPlaylist);
      setTimeout(() => {
        this.savePlaylistsToFS();
      }, 200);
      newPlaylistName.value = "";
      document.body.classList.remove("showPlaylistAdder");
    },
    savePlaylistsToFS() {
      const json = JSON.stringify(this.playlists);
      electron.ipcRenderer.send("savePlaylists", json);
    },
  },
};
</script>

<style lang="scss">
.showPlaylistAdder {
  .playlistAdder {
    top: 10px;
  }
}
.form {
  transition: 0.2s;
  position: fixed;
  top: -800px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(19, 19, 19);
  text-align: center;
  border-radius: 10px;
  input {
    margin: 10px;
    margin-top: 0px;
    font-size: 1.2em;
    padding: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.082);
    outline: none;
    color: white;
    border: 2px solid transparent;
  }
  input:focus {
    border-radius: 20px;
    border: 2px solid rgba(146, 147, 148, 0.596);
    background: rgba(255, 255, 255, 0);
  }
}
label {
  font-size: 1.2em;
  padding: 10px;
  display: block;
}
</style>
