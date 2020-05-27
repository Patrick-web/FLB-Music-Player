const state = {
    playlists:[

    ],
    songQueue:[

    ]
};

const getters = {
    playlists: (state)=>state.playlists,
    songQueue: (state)=>state.songQueue
};

const actions = {
    addSongsFromFolder({commit},songs){
        commit('addSongsFromFolder',songs)
    },
    addNewPlaylist({commit},newPlaylist){
        commit('addPlaylist',newPlaylist)
    },
    addSongToPlaylist({commit},data){
        commit('addSongToPlaylist',data)
    },
    loadPlaylist({commit},index){
        commit('loadPlaylist',index)
    }
};

const mutations = {
    addSongsFromFolder: (state,songs)=>state.songQueue = songs,
    addPlaylist: (state,newPlaylist) => state.playlists.unshift(newPlaylist),
    addSongToPlaylist:(state,data) => state.playlists[data.playlistIndex].songs.push(data.song),
    loadPlaylist: (state,index) => state.songQueue = state.playlists[index].songs
};

export default {
    state,
    getters,
    actions,
    mutations
}