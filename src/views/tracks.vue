<template>
  <div class="tracksView">

    <navigation v-on:renderSongs="renderSongs"/>

    <transition-group style="display:flex;flex-direction:column;align-items:flex-end"  name="slideIn" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft">
      <!-- <kinesis-container
      class="parent"
      :audio="audioFile"
      :playAudio="isPlaying">
      <button
      class="button"
      @click="changeState"
      />
    <kinesis-audio
      class="child"
      type="scale"
      :strength="30"
      :audioIndex="75"
    > -->
      <card
        :key='song.title'
         v-for="(song) in songQueue"
        :path="song.path" 
        :poster="song.poster"
        :songTitle="song.title"
        :duration="song.duration"
      />


    <!-- </kinesis-audio> -->
    <!-- <card/> -->
    <!-- <card/>
    <card/>
    <card/>
    <card/>
    <card/>
    <card/> -->

  <!-- </kinesis-container> -->
    </transition-group>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
const songSrc = require('@/assets/song.mp3')
import card from '@/components/card.vue'
import navigation from '@/components/nav.vue'
import * as electron from 'electron';

export default {
  data(){return{
    audioFile:songSrc,
    isPlaying: false,
    songs:[]
  }},
  computed:mapGetters(['songQueue']),
  components:{
    card,
    navigation
  },
  methods: {
    ...mapActions(['addSongsFromFolder']),

    renderSongs(songs){
      const withDuplicates = [...this.songQueue,...songs];
      console.log(withDuplicates.length);
      const pureSongs = withDuplicates.reduce((acc, current) => {
      const x = acc.find(item => item.path === current.path);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      console.log(pureSongs.length);
      this.addSongsFromFolder(pureSongs);
      // this.songQueue = pureSongs
        document.body.classList.remove('loadingNow');
        document.querySelector('#loadingImg').classList.remove('jello');

      this.saveToJson(pureSongs);
      console.log("songs rendered");
    },
    saveToJson(songs){
      const json = JSON.stringify(songs);
      const isSaved = electron.ipcRenderer.sendSync("savePlaylist", json);
      console.log(isSaved);
      // console.log(json);
      // let data = electron.ipcRenderer.sendSync("savePlaylist", folder);

    }
  },
  mounted(){
    setTimeout(()=>{
      const songsData = electron.ipcRenderer.sendSync("getSongs");
      let prevSongs = JSON.parse(songsData);
      this.renderSongs(prevSongs);
    },500)
  }
}
</script>

<style>
.tracksView{
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  position: relative;
  z-index: 2;
  height: 100vh;
  overflow: scroll;
  padding-bottom: 50px;
  scroll-behavior: smooth;
}


.parent {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.button {
  width: 75px;
  height: 75px;
  background-color: gray;
  border-radius: 50%;
  position: absolute;
  top: 25%;
  left: 25%;
}
.button::before,
.button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.button::before {
  width: 30px;
  height: 30px;
  display: none;
  background-color: white;
}
.button::after {
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid white;
}
.button.button--playing::before {
  display: block;
}
.button.button--playing::after {
  display: none;
}
</style>