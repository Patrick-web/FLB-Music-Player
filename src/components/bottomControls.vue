<template>
  <div class="playerArea">
    <img id="stars" @click="showFeatures" src="@/assets/stars.svg" alt="" />
    <features />
    <div class="visulizerArea" style="z-index:-1">
      <!-- <visualizer /> -->
    </div>
    <div class="controls-cont">
      <audio src="" id="myAudio"></audio>
      <div class="audioInfo">
        <p id="playingTitle" class="songTitle">Sittin' throwin Rocks</p>
        <!-- <p class="artist">Lexion Beats</p> -->
        <img src="@/assets/poster.png" id="songPoster" alt="" />
        <!-- <p class="duration">2:00</p> -->
      </div>
      <input
        id="progressBar"
        min="0"
        value="0"
        v-on:change="seek"
        type="range"
      />

      <div class="controls">
        <div class="btn btn-favour">
          <plAdder />
          <br />
          <img @click="showListAdder" src="@/assets/favourite.svg" alt="" />
        </div>
        <div @click="pauseOrPlay" class="btn btn-play">
          <playbackBt />
        </div>
        <div @click="loop" class="btn btn-repeat">
          <br />
          <img src="@/assets/repeat.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import visualizer from "@/components/visualizer.vue";
import playbackBt from "@/components/play-pauseBt.vue";
import plAdder from "@/components/playListAdder.vue";
import features from "@/components/features.vue";
export default {
  components: {
    playbackBt,
    visualizer,
    plAdder,
    features,
  },
  data() {
    return {
      songLength: 100,
    };
  },
  methods: {
    showFeatures() {
      document.body.classList.add("showFeatures");
    },
    showListAdder() {
      document.body.classList.toggle("showListAdder");
    },
    loop() {
      document.querySelector(".btn-repeat").classList.toggle("loop");
      document.querySelector("#myAudio").loop = !document.querySelector(
        "#myAudio"
      ).loop;
    },
    pauseOrPlay() {
      document.body.classList.add("clicked");
      setTimeout(() => {
        document.body.classList.remove("clicked");
      }, 400);

      if (document.body.classList.contains("playingSong")) {
        document.body.classList.remove("playingSong");
        console.log("pausing");
        const audio = document.querySelector("#myAudio");
        audio.pause();
        window.isPlaying = true;
        console.clear();
        console.log("Duration" + audio.duration);
        console.log("currentTime" + audio.currentTime);
      } else {
        document.querySelector("#myAudio").play();
        console.log("playing");
        document.body.classList.add("playingSong");
      }
    },
    seek(e) {
      document.querySelector("#myAudio").currentTime = e.target.value;
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.hideControls {
  .controls-cont {
    transform: scale(0);
  }
}
.playerArea {
  position: relative;
  height: 100vh;
  #stars {
    position: absolute;
    top: 10px;
    right: 0;
    width: 50px;
    transform: scale(1);
    transition: 0.2s cubic-bezier(1, 0, 0, 1);
    z-index: 11;
  }
  #stars:hover {
    cursor: pointer;
  }
}
.visulizerArea {
  height: 69%;
}
#progressBar {
  width: 95%;
  margin-left: 10px;
  margin-right: 10px;
}
.controls-cont {
  transform: scale(1);
  transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 4;
  width: 100%;
  bottom: 0;
  position: absolute;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(transparent, rgba(1, 54, 50, 0.267));
}

.btn {
  margin-left: 15px;
  margin-right: 15px;
  img {
    width: 70%;
  }
}
.btn:hover {
  cursor: pointer;
}
.btn-repeat {
  margin-right: 25px;
  margin-top: 10px;
  position: relative;
}
.btn-favour {
  margin-left: 25px;
}
#progressBar {
  -webkit-appearance: none;
  margin: 18px 0;
  width: 100%;
  border-radius: 20px;
}
#progress::webkit-range-progress {
  background: black;
}
#progressBar:focus {
  outline: none;
}
#progressBar::-webkit-slider-runnable-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: linear-gradient(90deg, #00ffff, #ceefff);
  border-radius: 40px;
}
#progressBar::-webkit-slider-thumb {
  box-shadow: 1px 1px 10px #000000;
  height: 20px;
  width: 5px;
  border-radius: 10px;
  background: linear-gradient(45deg, rgb(0, 89, 255), #00ffff);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}
#progressBar::-webkit-slider-thumb:hover {
  cursor: e-resize;
}
.audioInfo {
  // background: lemonchiffon;
  position: relative;
  height: 80px;
}
.songTitle {
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 10px;
  position: absolute;
  top: 0%;
  left: 0%;
  width: 88%;
}
.artist {
  position: absolute;
  left: 0%;
  bottom: 10%;
}
#songPoster {
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translateY(-50%);
  width: 70px;
}
.loop {
  filter: invert(100%);
}
</style>
