<template>
  <div class="tracksView">
    <div class="tactions">
      <p id="playingType">Added</p>
      <img
        id="backToAdded"
        @click="backToAddedSongs"
        src="@/assets/arrow.svg"
        alt
      />
    </div>
    <navigation />

    <transition-group
      style="display:flex;flex-direction:column;align-items:flex-end"
      name="slideIn"
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutLeft"
    >
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
      >-->
      <card
        :key="song.id"
        v-for="(song, index) in songQueue"
        :path="song.path"
        :poster="song.poster"
        :songTitle="song.title"
        :duration="song.duration"
        :id="song.id"
        :index="index"
      />

      <!-- </kinesis-audio> -->
      <!-- <card/> -->
      <!-- <card/>
    <card/>
    <card/>
    <card/>
    <card/>
      <card/>-->

      <!-- </kinesis-container> -->
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const songSrc = require("@/assets/song.mp3");
import card from "@/components/card.vue";
import navigation from "@/components/nav.vue";
import * as electron from "electron";

export default {
  data() {
    return {
      audioFile: songSrc,
      isPlaying: false,
      songs: [],
    };
  },
  computed: mapGetters(["songQueue"]),
  components: {
    card,
    navigation,
  },
  methods: {
    ...mapActions([
      "renderSongsFromFolder",
      "persistPreviouslyLoadedSongs",
      "renderPreviouslyLoaded",
      "loadRecents",
    ]),

    backToAddedSongs() {
      document.body.classList.remove("showBackArrow");
      document.querySelector("#playingType").style.marginLeft = "0px";
      this.renderSongsFromFolder();
      document.querySelector("#playingType").textContent = "Added";
    },
  },
  mounted() {
    setTimeout(async () => {
      const songsData = await electron.ipcRenderer.sendSync(
        "getPreviouslyAdded"
      );
      const recentsData = await electron.ipcRenderer.sendSync("getRecents");
      if (recentsData) {
        const recentSongs = JSON.parse(recentsData);
        this.loadRecents(recentSongs);
      }
      if (songsData) {
        const prevSongs = JSON.parse(songsData);
        this.persistPreviouslyLoadedSongs(prevSongs);
        this.renderPreviouslyLoaded(prevSongs);
      }
    }, 500);
  },
};
</script>

<style lang="scss">
.showBackArrow {
  #backToAdded {
    transform: scale(1) !important;
  }
}
.tracksView {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  position: relative;
  z-index: 2;
  height: 100vh;
  overflow: scroll;
  padding-bottom: 50px;
  scroll-behavior: smooth;
  span {
    width: 100%;
  }
  .tactions {
    display: flex;
    justify-content: space-evenly;
    padding-top: 10px;
    align-items: center;
    width: 100%;
    position: sticky;
    font-size: 1.8em;
    font-weight: 900;
    #backToAdded {
      margin-right: -100px;
      margin-left: -80px;
      width: 40px;
      transform: scale(0);
      transition: 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    #backToAdded:hover {
      cursor: pointer;
      filter: sepia(100%);
      transform: scale(1.1);
    }
  }
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
  content: "";
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
