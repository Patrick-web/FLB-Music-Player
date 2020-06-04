<template>
<div class="wrapper">
  <img class="animated faster" src="@/assets/splash.svg" id="splash" alt="">
  <img src="@/assets/logo.svg" style="transform:scale(0.6);position:fixed;top:-5px;left:-5px" alt="">
  <loading/>
  <div class="grid">
<!-- Settings -->
    <div style="position:relative;margin-left:80px"><playlist/></div>
    <player/>
    <tracks/>
  </div>
  <!-- <start/> -->
  <bg/>
  <!-- <sideNav/> -->
</div>

</template>
<script>
import playlist from './components/playlists.vue'
import bg from '@/components/particleBg.vue'
import tracks from '@/views/tracks.vue'
import start from '@/views/start.vue'
import sideNav from '@/components/sideNav.vue'
import player from '@/components/bottomControls.vue'
import loading from '@/components/loading.vue'

import 'module';
export default {
  data() {
    return {
      isPlaying: false,
    }
  },
  mounted(){
    const audio = document.querySelector('#myAudio');
    console.clear();
    setTimeout(()=>{
      document.querySelector('#splash').classList.add('fadeOutLeft');
    },4000)
    document.body.classList.add('hideControls');
    window.addEventListener('keydown',(e)=>{
      console.log(e.code);
      if(e.code==='Space'){
        if(e.srcElement.classList.contains('inputElem')){
          console.log("normal behaviour");
        }else{
          e.preventDefault();
          if(document.body.classList.contains('playingSong')){
            document.body.classList.remove('playingSong');
            audio.pause();
          }else{
            document.body.classList.add('playingSong')
            audio.play();
          }//
        }
      }
      if(e.code ==='ArrowLeft'){
        console.log("Called");
        audio.currentTime -=5;
      }else if(e.code ==='ArrowRight'){
        audio.currentTime +=5;
        console.log("Called");
      }
      })
  
      // var wavesurfer = WaveSurfer.create({
      // container: '#waveform',
      // waveColor: 'violet',
      // progressColor: 'purple'
      // });
      // console.log(this.audioFile);
      // wavesurfer.load(this.audioFile);

      
  },
  methods: {
    changeState() {
      this.isPlaying = !this.isPlaying
    },

  },
  components:{
    bg,
    tracks,
    player,
    start,
    sideNav,
    loading,
    playlist,
  }
}
</script>
<style>
@import "./assets/animate.css";

*{
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
body{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black ;
}
::-webkit-scrollbar{
  background: pink;
  width: 5px;
}
::-webkit-scrollbar-track-piece{
  background: rgb(0, 0, 0);
}
::-webkit-scrollbar-thumb{
  background: linear-gradient(rgb(0, 102, 255),rgb(47, 255, 168));
  border-radius: 10px;
}
#particles-js {
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
.wrapper{
  height: 100vh !important;
  width: 100%;
  color: rgb(255, 255, 255);
}
.grid{
  display: grid;
  grid-template-columns: 20% 50% 30%;
  height: 100vh;
}
#splash{
  position: fixed;
  top:0;
  left:0;
  width: 100vw;
  z-index: 10;
}
</style>