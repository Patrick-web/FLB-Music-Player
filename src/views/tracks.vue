<template>
  <div class="tracksView">

    <navigation v-on:renderSongs="renderSongs"/>

    <transition-group style="display:flex;flex-direction:column;align-items:flex-end"  name="slideIn" enter-active-class="animated fadeInRight" leave-active-class="animated hinge">
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
         v-for="(song,index) in songs"
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
const songSrc = require('@/assets/song.mp3')
import card from '@/components/card.vue'
import navigation from '@/components/nav.vue'

export default {
  data(){return{
    audioFile:songSrc,
    isPlaying: false,
    songs:[]
  }},
  components:{
    card,
    navigation

  },
  methods: {

    renderSongs(songs){
        songs.forEach(song => {
            this.songs.push(song);
        })
        document.body.classList.remove('loadingNow');
        document.querySelector('#loadingImg').classList.remove('jello');

      console.log("rendering songs");
    }
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