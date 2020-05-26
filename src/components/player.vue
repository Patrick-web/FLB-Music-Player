<template>
  <div class="player">
      <div class="vz-wrapper">
        <audio id="myAudio" :src=song data-author="Beethoven" data-title="Allegro"></audio>

        <div class="vz-wrapper -canvas">
            <canvas id="myCanvas" width="800" height="400"></canvas>
        </div>
    </div>
  <!-- <controls v-on:playstate='playOrPause'/> -->
  </div>
</template>

<script>
import controls from '@/components/bottomControls.vue'
// import '@/assets/visualise.js'
const songSrc = require('@/assets/song.mp3')

export default {
    components:{
        controls
    },
    data(){
    return{
        song:songSrc
    }
    },
    methods:{
        playOrPause(state){
            console.log(state);
            if(state === 'playing'){
                // document.querySelector('#myAudio').play();
            }else{
                // document.querySelector('#myAudio').pause();
            }

            // document.querySelector('#myAudio').play();
            // this.$emit('songIsPlaying')
        }
    },
    mounted(){
        window.currentSong = 'Fresh'
        window.artist = 'Ikson'
        console.log(this.song);
    }
}
</script>

<style>
.player{
    height: 100vh;
    position: fixed;
    width:100%;
    top:0;
    z-index: 6;
}
.vz-wrapper{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-left: -10px;
    position: relative;
}
#myCanvas{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
</style>