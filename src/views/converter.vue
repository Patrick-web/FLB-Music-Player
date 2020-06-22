<template>
  <div @click="unshrink" class="converter featurePage">
    <h1 style="width:250px;">Video to Mp3</h1>
    <p @click="closeConverter" id="closeMixer">Close Converter</p>

    <div class="grid2">
      <div class="functions">
        <div class="buttonn" @click="selectVideo" id="selectVideo">Select Video</div>
        <video id="video" controls src></video>
        <div class="buttonn" @click="convert" id="convertVideo">Convert</div>
      </div>
      <div class="converted">
        <h2 style="text-align:center">Converted</h2>
        <div
          :key="song.id"
          v-for="(song, index) in converted"
          class="card-song animated fast"
          @click.stop="playConverted(index)"
        >
          <div class="poster">
            <img :src="song.poster" alt />
          </div>

          <p class="song-title">{{ song.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as electron from "electron";
import { mapGetters, mapActions } from "vuex";
const convertImg = require("@/assets/convert.svg");
export default {
  data() {
    return {
      video: null,
      converted: []
    };
  },
  computed: mapGetters(["songQueue"]),
  created() {
    electron.ipcRenderer.on("progress", (e, percentage) => {
      document.querySelector(".innerBar").style.height = `${percentage}%`;
    });
    electron.ipcRenderer.on("convertedSong", (e, sdata) => {
      document.body.classList.add("hideInformerBody");
      this.showNotification({
        error: false,
        title: "Success",
        body: `Video converted Music/FLBtoMp3 Folder`
      });
      this.addConverted(sdata);
      document.querySelector(".innerBar").height = "0%";
    });
    electron.ipcRenderer.on("conversionError", (e, error) => {
      this.showConversionError();
    });
  },
  methods: {
    ...mapActions(["showNotification"]),
    unshrink() {
      if (document.body.classList.contains("shrinkConverter")) {
        document.body.classList.remove("shrinkConverter");
      }
    },
    closeConverter() {
      document.body.classList.remove("showConverter");
      this.unshrink();
    },
    playConverted(index) {
      document.body.classList.add("shrinkConverter");
      if (this.songQueue[0].id === this.converted[index].id) return;
      this.songQueue.unshift(this.converted[index]);
      setTimeout(() => {
        document.querySelector(".card").click();
      }, 100);
    },
    selectVideo() {
      let data = electron.ipcRenderer.sendSync("pickVideo");
      this.video = data;
      console.log(this.video);
      console.log(data);
      if (data) {
        document.querySelector("#video").src = "file://" + data;
      }
    },
    addConverted(res) {
      console.log(res);
      const mixObj = {
        id: res.id,
        title: res.title,
        path: res.path,
        poster: "/img/poster.e5b0f5a2.png",
        duration: res.duration
      };
      this.converted.unshift(mixObj);
      // console.log(this.songQueue[0]);
      // document.querySelector("#infoText").textContent = "Converted and Saved";
      // setTimeout(() => {
      //   document.body.classList.remove("showInformer");
      // }, 1000);
    },
    showConversionError() {
      this.showNotification({
        error: true,
        title: "Error",
        body: `Error in Converting Video`
      });
    },
    async convert() {
      document.body.classList.add("showInformer");
      document.querySelector("#mixLoader").classList.add("pulse");
      document.querySelector("#mixLoader").src = convertImg;
      document.querySelector("#infoText").textContent = "Converting...";
      setTimeout(() => {
        // this.startProgressRequests();
        // let progress = electron.ipcRenderer.send("getProgress");
        electron.ipcRenderer.send("convertVideoToMp3", this.video);
        // this.addConverted(res);
      }, 200);
    }
  }
};
</script>

<style lang="scss">
.showConverter {
  .converter {
    transform: translateY(0%);
  }
  #stars {
    display: none;
  }
}
.shrinkConverter {
  .converter {
    width: 70vw;
    height: 60vh;
  }
  .functions {
    display: none;
  }
  .grid2 {
    display: flex;
  }
  #stars {
    display: none;
  }
}
.converter {
  background: #1c002f;
  height: 100vh;
  width: 100vw;
  padding-top: 10px;
  position: fixed;
  top: 0;
  transform: translateY(-150%);
  transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10;
  overflow: hidden;
}
.converted {
  padding-top: 10px;
  // background: rgb(240, 240, 240);
  width: 70%;
  min-width: 400px;
  height: 80%;
  margin: auto;
  margin-top: 10px;
  border-radius: 10px;
  img {
    width: 50px;
  }
  .card-song {
    background: #310051;
    color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    width: 80%;
    padding: 10px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.164);
    p {
      margin-left: 10px;
    }
  }
  .card-song:hover {
    background: lighten($color: #310051, $amount: 3);
    cursor: pointer;
  }
}
.grid2 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  height: 100vh;
}
.functions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.buttonn {
  width: 80%;
  text-align: center;
  border-radius: 5px;
  padding-top: 7px;
  padding-bottom: 7px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.4em;
  font-weight: 900;
  transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.buttonn:hover {
  border-radius: 50px 1px 50px 10px;
  cursor: pointer;
  height: 100px;
  font-size: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
}
#selectVideo {
  background: linear-gradient(90deg, rgb(204, 0, 255), magenta);
}
#selectVideo:hover {
  margin-bottom: 60px;
}
#convertVideo {
  background: linear-gradient(90deg, orange, magenta);
}
#convertVideo:hover {
  margin-top: 60px;
}
video {
  width: 550px;
}
</style>
