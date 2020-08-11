<template>
  <div @click="fetch($event, podID)" class="squareCard">
    <div @click="expandCard($event)" class="expandArrow"></div>
    <div class="thumbnailArea">
      <img :src="podThumbnail" alt="" />
    </div>
    <img id="blurred" :src="podThumbnail" alt="" />
    <div class="cardInfo">
      <div class="infoTitle">{{ podName }}</div>
      <p style="display:none" id="podID">{{ podID }}</p>
      <br />
      <!-- <div class="infoContent">{{ podDescription }}</div> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["fetchPodcastData"]),
    fetch(e, podID) {
      /* if it is loaded then don't fetch 
  if its not loaded fetch and mark it as loaded
*/
      const target = e.currentTarget;
      if (!target.classList.contains("loadedPodcast")) {
        this.fetchPodcastData(podID);
        target.classList.add("loadedPodcast");
        console.log("Not fetched yet");
      }
      document.body.classList.add("showPodcastData");
    },
    expandCard(e) {
      const target = e.target.parentElement;
      if (target.classList.contains("expandCard")) {
        target.classList.remove("expandCard");
      } else {
        target.classList.add("expandCard");
      }
    },
  },
  props: {
    podName: String,
    podID: String,
    podDescription: String,
    podThumbnail: String,
  },
};
</script>

<style lang="scss">
.fetchingInProgress .squareCard {
  cursor: wait !important;
}
.squareCard {
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
  border-radius: 10px;
  width: 27%;
  min-height: 249px;
  min-width: 249px;
  margin-right: 10px;
  overflow: hidden;
  transition: 0.4s ease;
  position: relative;
  .expandArrow {
    position: absolute;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
    height: 20px;
    width: 25px;
    top: 10px;
    left: 10px;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    transform: rotate(180deg);
    transition: 0.2s ease;
    border-radius: 20px;
  }
  .expandArrow:hover {
    cursor: zoom-in;
  }
  .thumbnailArea {
    max-height: 11vw;
    // overflow: hidden;
    img {
      transform: rotate(0deg) scale(1);
      transition: transform 0.3s ease;
      width: 100%;
    }
  }
  .cardInfo {
    z-index: 3;
    padding: 8px;
    position: absolute;
    bottom: 0px;
    width: 93%;
    .infoTitle {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 5px;
      background: rgba(0, 0, 0, 0.37);
      width: 104%;
      margin-left: -10px;
      margin-bottom: -28px;
      padding-left: 10px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .infoContent {
      font-size: 1.1rem;
      font-weight: 300;
      max-height: 0;
      overflow: hidden;
    }
  }
}
.squareCard:hover {
  box-shadow: 8px 8px 4px rgba(0, 0, 0, 0.253);
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.25);
  transform: scale(1.03) rotateX(2deg) rotateY(2deg) translateZ(100px);
  cursor: pointer;
  .expandArrow {
    background: rgb(var(--base-one), var(--base-two), var(--base-three));
  }
  .thumbnailArea {
    img {
      transform: rotate(2deg) scale(1.02);
    }
  }
}
#blurred {
  height: 52px;
  width: 100%;
  position: absolute;
  bottom: -20px;
  left: 0;
  filter: blur(10px);
  z-index: 1;
}
.expandCard {
  max-height: 800px;
  .expandArrow {
    transform: rotate(0deg);
  }
  .cardInfo {
    .infoContent {
      max-height: 800px;
    }
  }
}
</style>
