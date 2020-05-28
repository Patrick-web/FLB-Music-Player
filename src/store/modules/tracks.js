import * as electron from 'electron';

const state = {
    playlists:[

    ],
    songQueue:[

    ],
    addedSongs:[]
};

const getters = {
    playlists: (state)=>state.playlists,
    songQueue: (state)=>state.songQueue
};

const actions = {
    removeSongFromQueue({commit},index){
        commit('removeSongFromQueue',index)
    },
    persistFolderSongs({commit},songs){
        commit('persistFolderSongs',unduplicate(songs))
    },
    renderSongsFromFolder({commit}){
        commit('renderSongsFromFolder');
    },
    addNewPlaylist({commit},newPlaylist){
        commit('addPlaylist',newPlaylist)
        actions.savePlaylistsToFS();
    },
    deletePlaylist({commit},index){
        commit('deletePlaylist',index);
        actions.savePlaylistsToFS();
    },
    editPlaylist({commit},data){
        commit('editPlaylist',data)
    },
    addSongToPlaylist({commit},data){
        commit('addSongToPlaylist',data)
        actions.savePlaylistsToFS();
    },
    renderPlaylist({commit},index){
        document.querySelector('#playingType').textContent = state.playlists[index].name;
        commit('renderPlaylist',index);
    },
    savePlaylistsToFS(){
        const json = JSON.stringify(state.playlists);
        electron.ipcRenderer.send("savePlaylists", json);
    },
    loadPlaylistsFromFS({commit},playlists){
        commit('loadPlaylistsFromFS',playlists)
    },
    persistPreviouslyLoadedSongs({commit},songs){
        commit('persistPreviouslyLoadedSongs',songs)
    },
    renderPreviouslyLoaded({commit},songs){
        commit('renderPreviouslyLoaded',songs)
    }
};

const mutations = {
    removeSongFromQueue:(state,index)=>state.songQueue.splice(index,1),

    renderPreviouslyLoaded:(state,songs)=>state.songQueue = songs,

    renderSongsFromFolder: (state)=>state.songQueue = state.addedSongs,

    persistFolderSongs: (state,songs)=>state.addedSongs = [state.addedSongs,...songs],

    persistPreviouslyLoadedSongs: (state,songs)=>state.addedSongs = songs,

    addPlaylist: (state,newPlaylist) => state.playlists.unshift(newPlaylist),

    addSongToPlaylist:(state,data) => state.playlists[data.playlistIndex].songs.push(data.song),

    renderPlaylist: (state,index) => state.songQueue = state.playlists[index].songs,

    loadPlaylistsFromFS:(state,playlists) => state.playlists = playlists,

    editPlaylist:(state,data) =>{
        const {plIndex,plName,sTargets} = data;
        state.playlists[plIndex].name = plName;
        console.log(sTargets);
        if(sTargets.length>0){
            sTargets.forEach(target => {
                state.playlists[plIndex].songs = state.playlists[plIndex].songs
                .filter((song)=>song.id!=target);                         
            });
        }
    },

    deletePlaylist:(state,index)=> state.playlists.splice(index,1)
};
function  unduplicate(array){
    const withDuplicates = [...array,state.addedSongs];
    const pureSongs = withDuplicates.reduce((acc, current) => {
    const x = acc.find(item => item.path === current.path);
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
    mutations
}

