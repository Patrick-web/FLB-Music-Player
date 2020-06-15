<template>
  <div class="wrapper">
    <img class="animated faster" src="@/assets/splash.svg" id="splash" alt />
    <img
      src="@/assets/logo.svg"
      style="transform:scale(0.6);position:fixed;top:-5px;left:-5px"
      alt
    />
    <progressBar />
    <loading />
    <notification />
    <div class="mixingloader">
      <img
        id="mixLoader"
        class="animated infinite"
        src="@/assets/mixing.png"
        alt
      />
      <h2 id="infoText">Mixing...</h2>
    </div>

    <div class="grid">
      <div style="position:relative;margin-left:80px">
        <playlist />
      </div>
      <player />
      <tracks />
    </div>
    <bg />
    <mixer id="mixerCont" />
    <converter />
  </div>
</template>
<script>
import playlist from "./components/playlists.vue";
import bg from "@/components/particleBg.vue";
import tracks from "@/views/tracks.vue";
import start from "@/views/start.vue";
import mixer from "@/views/mixer.vue";
import converter from "@/views/converter.vue";
import sideNav from "@/components/sideNav.vue";
import player from "@/components/bottomControls.vue";
import loading from "@/components/loading.vue";
import progressBar from "@/components/progressBar.vue";
import notification from "@/components/notification.vue";

export default {
  data() {
    return {
      isPlaying: false,
    };
  },
  mounted() {
    const audio = document.querySelector("#myAudio");
    console.clear();
    setTimeout(() => {
      document.querySelector("#splash").classList.add("fadeOutLeft");
    }, 4000);
    document.body.classList.add("hideControls");
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (e.srcElement.classList.contains("inputElem")) {
          console.log("normal behaviour");
        } else {
          e.preventDefault();
          if (document.body.classList.contains("playingSong")) {
            document.body.classList.remove("playingSong");
            audio.pause();
          } else {
            document.body.classList.add("playingSong");
            audio.play();
          } //
          document.body.classList.add("clicked");
          setTimeout(() => {
            document.body.classList.remove("clicked");
          }, 500);
        }
      }
      if (e.code === "ArrowLeft") {
        audio.currentTime -= 5;
      } else if (e.code === "ArrowRight") {
        audio.currentTime += 5;
      }
    });

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
      this.isPlaying = !this.isPlaying;
    },
  },
  components: {
    bg,
    tracks,
    player,
    start,
    sideNav,
    loading,
    playlist,
    mixer,
    converter,
    progressBar,
    notification,
  },
};
</script>
<style lang="scss">
@import "./assets/animate.css";
@import "../node_modules/typeface-roboto/index.css";

* {
  margin: 0;
  padding: 0;
  font-family: "Roboto";
}
body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;
}
::-webkit-scrollbar {
  background: pink;
  width: 5px;
}
::-webkit-scrollbar-track-piece {
  background: rgb(0, 0, 0);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(rgb(0, 102, 255), rgb(47, 255, 168));
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
.wrapper {
  height: 100vh !important;
  width: 100%;
  color: rgb(255, 255, 255);
}
.grid {
  display: grid;
  grid-template-columns: 20% 50% 30%;
  height: 100vh;
}
#splash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 20;
}
.showInformer {
  .mixingloader {
    transform: scale(1);
  }
  .bar {
    transform: scale(1) translateY(-50%) rotate(180deg);
  }
}
.hideInformerBody {
  .mixLoader {
    display: none;
  }
  #infoText {
    display: none;
  }
}
.mixingloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, purple, rgb(59, 0, 59));
  opacity: 0.9;
  z-index: 13;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 3em;
  color: magenta;
  transition: 0.05s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: scale(0);
}
</style>
