import * as electron from 'electron';

const state = {
    playlists:[

    ],
    songQueue:[

    ],
    addedSongs:[

    ],
    recents:[

    ]
};

const getters = {
    playlists: (state)=>state.playlists,
    songQueue: (state)=>state.songQueue,
    recents: (state)=>state.recents
};

const actions = {
    addToRecents({commit},index){
        commit('addToRecents',index);

    },
    loadRecents({commit},songs){
        commit('loadRecents',songs);
    },
    renderRecents({commit}){
        document.body.classList.add('showingBackBt');
        document.querySelector('#playingType').style.marginLeft = '-50px'
        document.querySelector('#playingType').textContent = 'Recently Played'
        document.body.classList.add('showBackArrow');

        commit('renderRecents');
    },
    removeSongFromQueue({commit},index){
        commit('removeSongFromQueue',index)
    },
    persistFolderSongs({commit},songs){
        commit('persistFolderSongs',unduplicate(songs,state.addedSongs))
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
        commit('renderPreviouslyLoaded',unduplicate(songs,state.addedSongs));
        // const rendered = document.querySelectorAll('.card');
        // rendered[0].querySelector('.a')
    }
};

const mutations = {
    addToRecents:(state,index)=>{
        state.recents.push(state.songQueue[index]);
        state.recents = unduplicate(state.recents);
    },

    loadRecents:(state,songs)=>state.recents = songs,

    renderRecents:(state)=>state.songQueue = unduplicate(state.recents),

    removeSongFromQueue:(state,index)=>state.songQueue.splice(index,1),

    renderPreviouslyLoaded:(state,songs)=>state.songQueue = songs,

    renderSongsFromFolder: (state)=>state.songQueue = state.addedSongs,

    persistFolderSongs: (state,songs)=>state.addedSongs = [state.addedSongs,...songs],

    persistPreviouslyLoadedSongs: (state,songs)=>state.addedSongs = songs,

    addPlaylist: (state,newPlaylist) => state.playlists.unshift(newPlaylist),

    addSongToPlaylist:(state,data) => {
        state.playlists[data.playlistIndex].songs.push(data.song);
        state.playlists.forEach(list=>{
            console.log(list.songs);
            list.songs = unduplicate(list.songs)
            console.log(list.songs);
        })
    },

    renderPlaylist: (state,index) => state.songQueue = unduplicate(state.playlists[index].songs),

    loadPlaylistsFromFS:(state,playlists) =>{
         state.playlists = playlists

    },
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
function  unduplicate(array1,array2){
    let withDuplicates;
    if(array2){
        withDuplicates = [...array1,array2];
        console.log("Two arrays passed");
    }else{
        console.log("One array passed");
        withDuplicates = array1;
    }
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
