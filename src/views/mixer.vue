<template>
  <div @click="resetMixer" class="mixer featurePage">
    <h1>Mix Maker</h1>
    <p @click="closeMixer" id="closeMixer">Close Mixer</p>
    <div class="card-songs">
      <div
        :key="song.id"
        v-for="(song, index) in songsToMix"
        class="card-song animated fast"
        @click="mix($event, index)"
      >
        <div class="poster">
          <img :src="song.poster" alt />
        </div>

        <p class="song-title">{{ song.title }}</p>
        <p class="song-path" style="display:none">{{ song.path }}</p>
      </div>
    </div>
    <div class="blurDiv"></div>
    <div class="mixerCreator">
      <div class="mixcontrols">
        <div id="mixplayBt" style="padding:10px" @click="create">
          <img style="width:60px" src="@/assets/merge.svg" alt />
        </div>
        <div @click="saveMix" id="saveMix">Save</div>
        <form id="mixForm">
          <div class="form-group">
            <label for="mixname">Mix Title</label>
            <input
              type="text"
              class="inputElem"
              value="FLB Mix"
              name
              id="mixname"
            />
          </div>
          <div class="form-group">
            <label for="artist">Artist</label>
            <input
              type="text"
              class="inputElem"
              value="FLB player"
              id="artist"
            />
          </div>
          <div class="form-group">
            <label for="album">Album</label>
            <input type="text" class="inputElem" value="F Mixes" id="album" />
          </div>
          <div class="albArt">
            <img id="albArt" src="@/assets/poster.png" alt />
            <!-- <div style="text-align:center;font-weight:600" id="selectPoster">Select Album art</div> -->
          </div>
        </form>
      </div>

      <div class="nodeswrapper">
        <div
          :key="node.id"
          v-for="(node, index) in selectedToMix"
          class="mixnode animated fast"
        >
          <div class="nodeName">{{ node.title }}</div>
          <div class="nodeBlur"></div>
          <div class="removeBt" @click="removeSongFromMix($event, index)">
            Remove
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as electron from "electron";
import { mapGetters, mapActions } from "vuex";
const mergeImg = require("@/assets/mixing.png");

export default {
  data() {
    return {
      tags: {
        title: "FLB Mix",
        artist: "Flb Player",
        album: "FLB release",
        APIC: "/img/poster.e5b0f5a2.png",
      },
    };
  },
  computed: mapGetters(["songsToMix", "selectedToMix", "songQueue"]),
  methods: {
    ...mapActions(["addSongToMix", "unMix", "showNotification"]),
    mix(e, index) {
      const card = e.currentTarget;
      card.classList.add("bounceOutDown");
      setTimeout(() => {
        this.addSongToMix(index);
      }, 800);
      this.hideForm();
    },
    removeSongFromMix(e, index) {
      const node = e.currentTarget.parentElement;
      node.classList.add("zoomOut");
      setTimeout(() => {
        this.unMix(index);
        if (this.selectedToMix.length < 2) {
          if (document.body.classList.contains("showMixSaver")) {
            document.body.classList.add("showMixSaver");
          }
        }
      }, 600);
    },
    closeMixer() {
      document.body.classList.remove("showMixer");
      this.hideForm();
      this.resetMixer();
    },
    hideForm() {
      if (document.body.classList.contains("showMixForm")) {
        document.body.classList.remove("showMixForm");
      }
      if (document.body.classList.contains("showMixSaver")) {
        document.body.classList.remove("showMixSaver");
      }
    },
    resetMixer() {
      if (document.body.classList.contains("playingMix")) {
        document.body.classList.remove("playingMix");
      }
    },
    getTags() {
      const tags = {
        title: document.querySelector("#mixname").value,
        artist: document.querySelector("#artist").value,
        album: document.querySelector("#album").value,
        APIC: document.querySelector("#albArt").src,
      };
      return tags;
    },
    playDraftMix(data) {
      const mixObj = {
        id: JSON.stringify(Date.now()),
        title: "Unsaved Mix",
        path: data.mixPath,
        poster: "/img/poster.e5b0f5a2.png",
        duration: data.mixData.format.duration,
      };
      document.body.classList.add("dontPushToRecents");
      this.songQueue.unshift(mixObj);
      this.clickFirstSong();
    },
    saveMix() {
      if (document.body.classList.contains("showMixForm")) {
        this.hideForm();
        electron.ipcRenderer.send("saveMix", this.getTags());
        this.songQueue.shift();
      } else {
        document.body.classList.add("showMixForm");
      }
    },
    clickFirstSong() {
      setTimeout(() => {
        document.querySelector(".card").click();
        document.body.classList.add("playingMix");
        document.body.classList.remove("showInformer");
        document.querySelector("#mixLoader").classList.remove("pulse");
        document.body.classList.add("showMixSaver");
      }, 100);
    },
    handleMixError() {
      document.querySelector("#mixLoader").classList.remove("pulse");
      alert("Error in mixing");
    },
    AddnPlayMix(mix) {
      this.songQueue.push(mix);
      setTimeout(() => {
        document.body.classList.remove("showInformer");
        const cards = document.querySelectorAll(".card");
        const lastCard = cards[cards.length - 1];
        lastCard.click();
        document.body.classList.add("playingMix");
      }, 1000);
    },
    async create() {
      if (this.selectedToMix.length > 1) {
        console.log(this.selectedToMix);
        document.body.classList.add("showInformer");
        document.querySelector("#mixLoader").src = mergeImg;
        document.querySelector("#infoText").textContent = "Mixing...";
        document.querySelector("#mixLoader").classList.add("pulse");
        setTimeout(async () => {
          const songPaths = this.selectedToMix.map((song) => song.path);
          electron.ipcRenderer.send("mixSongs", songPaths);
        }, 200);
      } else {
        this.showNotification({
          error: true,
          title: "Error",
          body: `Cannot create mix of less than 2 songs`,
        });
      }
    },
  },
  components: {},
  mounted() {
    electron.ipcRenderer.on("mixprogress", (e, percentage) => {
      document.querySelector(".innerBar").style.height = `${percentage}%`;
    });
    electron.ipcRenderer.on("mixSaved", (e, mdata) => {
      this.AddnPlayMix(mdata);
      this.showNotification({
        error: false,
        title: "Sucess",
        body: `Mix saved to Music/flbMixes Folder`,
      });
      document.querySelector(".innerBar").style.height = "0%";
      console.log("Progress Bar reset");
    });
    electron.ipcRenderer.on("mixSaveError", (e) => {
      this.showNotification({
        error: true,
        title: "Error",
        body: `Error in saving mix`,
      });
    });
    electron.ipcRenderer.on("mixingError", (e, err) => {
      this.showNotification({
        error: true,
        title: "Error",
        body: `An error occured in create the Mix`,
      });
    });
    electron.ipcRenderer.on("draftMixSaved", (e, data) => {
      document.body.classList.remove("showInformer");
      console.log("from message");
      this.playDraftMix(data);
      this.showNotification({
        error: false,
        title: "Done",
        body: `Draft mix created`,
      });
    });
    electron.ipcRenderer.on("promptInternet", (e) => {
      this.showNotification({
        error: true,
        title: "Error",
        body: `Please turn on internet connection to download files required to use this feature`,
      });
    });
  },
};
</script>

<style lang="scss">
.playingMix {
  .mixer {
    height: 68vh;
  }
  .mixerCreator {
    background: rgb(75, 1, 125) !important;
  }
}
.showMixSaver {
  #saveMix {
    transform: scale(1) !important;
  }
}
.showMixForm {
  #mixForm {
    transform: scale(1) !important;
  }
  #saveMix {
    top: -90px !important;
    z-index: 3;
  }
}

.featurePage {
  h1 {
    background: #9900ff;
    text-align: center;
    margin: auto;
    padding: 10px;
    width: 15%;
    border-radius: 50px;
    min-width: 200px;
  }
}
.showMixer {
  .mixer {
    transform: translateY(0%);
  }
}

.mixer {
  background: #1c002f;
  height: 100vh;
  padding-top: 10px;
  position: fixed;
  top: 0;
  transform: translateY(-100%);
  transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 12;
  overflow: hidden;
  .card-songs {
    position: relative;
    margin-top: 10px;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    max-height: 450px;
    overflow-y: scroll;
    // padding-left: 50px;
    .card-song {
      justify-self: center;
      width: 400px;
      background: #310051;
      position: relative;
      margin: 20px;
      padding: 10px;
      min-height: 75px;
      width: 300px;
      border-radius: 10px;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.308);
      display: flex;
      align-items: center;
      .song-title {
        text-align: left;
        margin-left: 10px;
      }
      img {
        width: 70px;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.74);
        transform: scale(1);
        transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }
    .card-song:hover {
      cursor: pointer;
      background: lighten($color: #7e0097, $amount: 10);
      img {
        transform: scale(1.05);
      }
    }
  }
  .blurDiv {
    transform: translateY(-100%);
    margin: 0;
    height: 80px;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(20, 0, 31, 0.103),
      rgba(20, 0, 31, 0.747)
    );
    filter: blur(5px);
    pointer-events: none;
  }
  .mixerCreator {
    background: rgba(153, 0, 255, 0.247);
    position: absolute;
    bottom: 0%;
    width: 100%;
    height: 180px;
    .nodeswrapper {
      display: flex;
      width: 100vw;
      overflow-x: scroll;
      position: absolute;
      bottom: 2px;
      padding-bottom: 50px;
    }
    .mixnode {
      background: #9900ff;
      min-width: 200px;
      max-width: 200px;
      height: 20px;
      margin: 10px;
      border-radius: 50px;
      padding: 5px 10px 10px 5px;
      position: relative;
      overflow: hidden;
      .nodeName {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        min-width: 1000px;
        transition: 10s ease-in-out;
      }
      .nodeBlur {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 50px;
        width: 50px;
        right: -5px;
        background: linear-gradient(
          90deg,
          rgba(118, 0, 148, 0.5),
          rgba(111, 0, 139, 0.897),
          rgb(107, 1, 134)
        );
        filter: blur(5px);
        // border-radius: 20px;
      }
      .removeBt {
        background: white;
        color: rgb(255, 0, 119);
        height: 30px;
        position: absolute;
        right: 0px;
        padding: 5px;
        padding-top: 15px;
        font-weight: 900;
        top: 50%;
        transform: translateY(-50%) scaleX(0);
        transform-origin: right;
        transition: 0.2s;
      }
      .removeBt:hover {
        background: rgb(255, 0, 55);
        color: white;
      }
    }

    .mixnode:hover {
      background: rgb(255, 0, 255);
      cursor: pointer;
      .nodeName {
        left: -800px;
      }
      .removeBt {
        transform: translateY(-50%) scaleX(1);
      }
    }
    .mixcontrols {
      position: relative;
      #mixplayBt {
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.616);
        position: absolute;
        top: -35px;
        left: 48%;
        transform: translateX(-50%, -50%);
        background: #2e004c;
        border-radius: 10px;
        padding: 5px;
        transform: scale(1);
        transition: 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
      #mixplayBt:hover {
        transform: scale(1.1);
        top: -40px;
        cursor: pointer;
        box-shadow: 0px 0px 30px rgba(204, 0, 255, 0.616);
        background: lighten($color: rgb(187, 0, 187), $amount: 5);
        img {
          filter: sepia(1);
        }
      }
      #saveMix {
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.788);
        position: absolute;
        top: -25px;
        left: 72%;
        transform: translateX(-50%, -50%);
        background: rgb(0, 134, 83);
        border-radius: 50px;
        padding: 5px;
        width: 100px;
        height: 40px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        font-weight: 900;
        transform: scale(0);
        transition: 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
      #saveMix:hover {
        cursor: pointer;
        box-shadow: 0px 0px 30px rgba(0, 255, 255, 0.788);
        background: lighten($color: rgb(0, 129, 134), $amount: 2);
        // width: 120px;
        top: -30px;
        // height: 60px;
        border-radius: 5px;
      }
      #mixForm {
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.616);
        position: absolute;
        top: -450px;
        left: 68%;
        transform: translateX(-50%, -50%);
        background: rgb(84, 0, 139);
        border-radius: 10px;
        padding: 5px;
        width: 200px;
        height: 370px;
        transform: scale(0);
        transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        .form-group {
          margin-bottom: 10px;
        }
        input {
          background: #1f021fad;
          color: white;
          margin-bottom: 8px;
          padding: 5px;
          padding-left: 10px;
          margin-left: 10px;
          border-radius: 30px;
          width: 85%;
          outline: none;
          border: none;
          font-size: 1em;
          font-weight: 400;
        }
        img {
          width: 70px;
          margin-left: 10px;
          display: block;
        }
      }
      .albArt {
        margin-top: 10px;
        display: flex;
        // display: grid;
        // grid-template-columns: 1fr 1fr;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

#mixprogressBar {
  -webkit-appearance: none;
  margin: 18px 0;
  margin-top: 60px;
  margin-left: 40px;
  width: 95%;
  border-radius: 20px;
}
#mixprogressBar:focus {
  outline: none;
}
#mixprogressBar::-webkit-slider-runnable-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: linear-gradient(90deg, #00ffff, #ceefff);
  border-radius: 40px;
}
#mixprogressBar::-webkit-slider-thumb {
  box-shadow: 1px 1px 10px #000000;
  height: 20px;
  width: 5px;
  border-radius: 10px;
  background: linear-gradient(45deg, rgb(0, 89, 255), #00ffff);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}
#mixprogressBar::-webkit-slider-thumb:hover {
  cursor: e-resize;
}
#closeMixer {
  position: absolute;
  top: 25px;
  right: 10px;
  background: white;
  font-weight: 900;
  color: rgb(255, 0, 140);
  padding: 5px 10px 5px 10px;
  border-radius: 20px;
}
#closeMixer:hover {
  background: rgb(255, 0, 140);
  color: white;
  cursor: pointer;
}
#selectPoster {
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
}
#selectPoster:hover {
  background: rgba(53, 0, 53, 0.425);
  cursor: pointer;
}
</style>
