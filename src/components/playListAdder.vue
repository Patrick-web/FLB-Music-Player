<template>
  <div class="plAdder">
      <button @click="showPlaylistAdder">New</button>
      <div class="pls">
          <div :key='playlist.id' v-for="(playlist,index) in playlists" @click="addSongTolist(index)" class="pl">{{playlist.name}}</div>
      </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';

export default {
    methods:{
        ...mapActions(['addSongToPlaylist']),
        addSongTolist(playlistIndex){
            const song = window.currentSong;
            console.log(song);
            const data = {
                song,
                playlistIndex
            }
            this.addSongToPlaylist(data);
            document.body.classList.remove('showListAdder');
            // console.log(playlistIndex);
        },
        showPlaylistAdder(){
            document.body.classList.add('showPlaylistAdder');
            document.querySelector('#newPlaylist').focus();
            document.body.classList.remove('showListAdder');
        }
    },
    computed:mapGetters(['playlists']),


}
</script>

<style lang="scss">
.showListAdder{
    .plAdder{
        transform: translateX(-100%) scale(1);
    }
}
.plAdder{
    transition: 0.2s;
    position: absolute;
    left:-10px;
    bottom: 20px;
    transform: translateX(-100%) scale(0);
    background: rgb(22, 22, 22);
    font-size: 1.2rem;
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
    button{
        font-size: 1.2rem;
        width: 90%;
        background: rgb(0, 183, 255);
        border:none;
        padding: 5px;
        color: white;
        font-weight: 700;
        margin: 5px;
        border-radius: 5px;
        outline: none;
    }
    button:hover{
        cursor: pointer;
        background: blueviolet;
    }
    button:active{
        background: blueviolet;
    }
    .pl{
        padding: 5px;
        border-bottom: 1px solid gray;
    }
    .pl:hover{
        cursor: pointer;
        background: blueviolet;
    }
}
</style>