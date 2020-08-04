<template>
  <div class="wrapper">
    <img class="animated faster" src="@/assets/splash.svg" id="splash" alt />
    <img src="@/assets/logo.svg" id="flbLogo" @click="toggleInfo" />
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
    <myprofile />
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
    <Podcasts />
  </div>
</template>
<script>
import myprofile from "./components/profile.vue";
import playlist from "./components/playlists.vue";
import bg from "@/components/particleBg.vue";
import tracks from "@/views/tracks.vue";
import start from "@/views/start.vue";
import mixer from "@/views/mixer.vue";
import converter from "@/views/converter.vue";
import Podcasts from "@/views/PodcastPlayer.vue";
import lyricsMaker from "@/views/lyricsMaker.vue";
import player from "@/components/bottomControls.vue";
import loading from "@/components/loading.vue";
import progressBar from "@/components/progressBar.vue";
import notification from "@/components/notification.vue";
import * as electron from "electron";

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
    function getBinaries() {
      electron.ipcRenderer.send("downloadBinaries");
    }
    window.addEventListener("online", getBinaries);
  },
  methods: {
    changeState() {
      this.isPlaying = !this.isPlaying;
    },
    toggleInfo() {
      document.body.classList.toggle("showInfo");
    },
  },
  components: {
    bg,
    myprofile,
    tracks,
    player,
    start,
    loading,
    playlist,
    mixer,
    converter,
    lyricsMaker,
    Podcasts,
    progressBar,
    notification,
  },
};
</script>
<style lang="scss">
@import "./assets/animate.css";
@import "../node_modules/typeface-roboto/index.css";
@import "./assets/theme/theme.css";

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
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  background: rgb(0, 0, 0);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, rgb(0, 102, 255), rgb(47, 255, 168));
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
.showInfo {
  .info-card {
    transform: scale(1) translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  #flbLogo {
    filter: invert(100%);
  }
}
#flbLogo {
  transform: scale(0.6);
  position: fixed;
  top: -5px;
  left: -5px;
  z-index: 10;
}
#flbLogo:hover {
  cursor: pointer;
}
.info-card {
  position: fixed;
  z-index: 10;
  top: -20%;
  left: -15%;
  transform: scale(0) translate(0%, 0%);
  background: linear-gradient(150deg, rgb(0, 193, 207), rgb(0, 110, 255));
  width: 330px;
  height: 300px;
  border-radius: 15px;
  padding: 10px;
  transition: 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  .info-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 1.2em;
    .it {
      font-weight: 700;
      font-size: 1.25em;
    }
    .i {
      background: rgba(0, 0, 0, 0.226);
      padding: 5px;
      border-radius: 20px;
    }
    .i:hover {
      cursor: default;
    }
  }
}
.gif {
  text-align: center;
  margin-top: -50px;
}
#gif {
  width: 200px;
  border-radius: 10px;
  box-shadow: 4px 2px 10px rgba(8, 8, 8, 0.384);
}
</style>
