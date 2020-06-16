import * as electron from "electron";

const state = {
  playlists: [],
  songQueue: [],
  addedSongs: [],
  recents: [],
  songsToMix: [],
  selectedToMix: [],
};

const getters = {
  playlists: (state) => state.playlists,
  songQueue: (state) => state.songQueue,
  recents: (state) => state.recents,
  songsToMix: (state) => state.songsToMix,
  selectedToMix: (state) => state.selectedToMix,
};

const actions = {
  showNotification({ commit }, data) {
    document.body.classList.add("notifyUser");
    if (data.error) {
      document.body.classList.add("error-notification");
    } else {
      if (document.body.classList.contains("error-notification")) {
        document.body.classList.remove("error-notification");
      }
    }
    document.querySelector(".not-title").textContent = data.title;
    document.querySelector(".not-body").textContent = data.body;
  },
  addSongToMix({ commit }, index) {
    commit("addSongToMix", index);
  },
  unMix({ commit }, index) {
    commit("unMix", index);
  },
  addToRecents({ commit }, index) {
    commit("addToRecents", index);
  },
  loadRecents({ commit }, songs) {
    commit("loadRecents", songs);
  },
  renderRecents({ commit }) {
    document.body.classList.add("showingBackBt");
    document.querySelector("#playingType").style.marginLeft = "-50px";
    document.querySelector("#playingType").textContent = "Recently Played";
    document.body.classList.add("showBackArrow");

    commit("renderRecents");
  },
  removeSongFromQueue({ commit }, index) {
    commit("removeSongFromQueue", index);
  },
  persistFolderSongs({ commit }, songs) {
    commit("persistFolderSongs", unduplicate(songs, state.addedSongs));
    commit("queueToMix", songs);
  },
  renderSongsFromFolder({ commit }) {
    commit("renderSongsFromFolder");
  },
  addNewPlaylist({ commit }, newPlaylist) {
    commit("addPlaylist", newPlaylist);
    actions.savePlaylistsToFS();
  },
  deletePlaylist({ commit }, index) {
    commit("deletePlaylist", index);
    actions.savePlaylistsToFS();
  },
  editPlaylist({ commit }, data) {
    commit("editPlaylist", data);
  },
  addSongToPlaylist({ commit }, data) {
    commit("addSongToPlaylist", data);
    actions.savePlaylistsToFS();
  },
  renderPlaylist({ commit }, index) {
    document.querySelector("#playingType").textContent =
      state.playlists[index].name;
    commit("renderPlaylist", index);
  },
  savePlaylistsToFS() {
    const json = JSON.stringify(state.playlists);
    electron.ipcRenderer.send("savePlaylists", json);
  },
  loadPlaylistsFromFS({ commit }, playlists) {
    commit("loadPlaylistsFromFS", playlists);
  },
  persistPreviouslyLoadedSongs({ commit }, songs) {
    commit("persistPreviouslyLoadedSongs", songs);
  },
  renderPreviouslyLoaded({ commit }, songs) {
    commit("renderPreviouslyLoaded", unduplicate(songs, state.addedSongs));
    commit("queueToMix", songs);
    // const rendered = document.querySelectorAll('.card');
    // rendered[0].querySelector('.a')
  },
};

const mutations = {
  addSongToMix: (state, index) => {
    state.selectedToMix.push(state.songsToMix[index]);
    state.songsToMix.splice(index, 1);
  },
  unMix: (state, index) => {
    state.songsToMix.push(state.selectedToMix[index]);
    state.selectedToMix.splice(index, 1);
  },

  queueToMix: (state, songs) =>
    (state.songsToMix = unduplicate([...state.songsToMix, ...songs])),

  addToRecents: (state, index) => {
    state.recents.push(state.songQueue[index]);
    state.recents = unduplicate(state.recents);
  },

  loadRecents: (state, songs) => (state.recents = songs),

  renderRecents: (state) => (state.songQueue = unduplicate(state.recents)),

  removeSongFromQueue: (state, index) => state.songQueue.splice(index, 1),

  renderPreviouslyLoaded: (state, songs) => (state.songQueue = songs),

  renderSongsFromFolder: (state) => (state.songQueue = state.addedSongs),

  persistFolderSongs: (state, songs) =>
    (state.addedSongs = unduplicate([...state.addedSongs, ...songs])),

  persistPreviouslyLoadedSongs: (state, songs) => (state.addedSongs = songs),

  addPlaylist: (state, newPlaylist) => state.playlists.unshift(newPlaylist),

  addSongToPlaylist: (state, data) => {
    state.playlists[data.playlistIndex].songs.push(data.song);
    state.playlists.forEach((list) => {
      console.log(list.songs);
      list.songs = unduplicate(list.songs);
      console.log(list.songs);
    });
  },

  renderPlaylist: (state, index) =>
    (state.songQueue = unduplicate(state.playlists[index].songs)),

  loadPlaylistsFromFS: (state, playlists) => {
    state.playlists = playlists;
  },
  editPlaylist: (state, data) => {
    const { plIndex, plName, sTargets } = data;
    state.playlists[plIndex].name = plName;
    console.log(sTargets);
    if (sTargets.length > 0) {
      sTargets.forEach((target) => {
        state.playlists[plIndex].songs = state.playlists[plIndex].songs.filter(
          (song) => song.id != target
        );
      });
    }
  },

  deletePlaylist: (state, index) => state.playlists.splice(index, 1),
};
function unduplicate(array1, array2) {
  let withDuplicates;
  if (array2) {
    withDuplicates = [...array1, ...array2];
    console.log("Two arrays passed");
  } else {
    console.log("One array passed");
    withDuplicates = array1;
  }
  const pureSongs = withDuplicates.reduce((acc, current) => {
    const x = acc.find((item) => item.path === current.path);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return pureSongs;
}
export default {
  state,
  getters,
  actions,
  mutations,
};
