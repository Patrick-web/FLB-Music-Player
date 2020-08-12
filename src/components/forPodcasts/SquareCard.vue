<template>
  <div @click="fetch($event, podID)" class="squareCard">
    <div
      @click.stop="
        toggleSubscription(
          $event,
          podID,
          podDescription,
          podThumbnail,
          podName,
          isSubscribed,
          genreIndex,
          podcastIndex
        )
      "
      v-bind:class="{ issubscribed: isSubscribed }"
      class="expandArrow"
    >
      <img src="@/assets/forPodcasts/DoubleBolt.svg" alt />
      <div>
        <span v-if="isSubscribed">Un</span>
        <span>Subscribe</span>
      </div>
    </div>
    <div class="thumbnailArea">
      <img :src="podThumbnail" alt />
    </div>
    <img id="blurred" :src="podThumbnail" alt />
    <div class="cardInfo">
      <div class="infoTitle">{{ podName }} {{ isSubscribed }}</div>
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
    ...mapActions([
      "fetchPodcastData",
      "subscribeToPodcast",
      "unSubscribeToPodcast",
      "updateRender"
    ]),
    fetch(e, podID) {
      /* if it is loaded then don't fetch 
  if its not loaded fetch and mark it as loaded
*/
      const target = e.currentTarget;
      if (!target.classList.contains("loadedPodcast")) {
        this.fetchPodcastData(podID);
        if (document.querySelector(".loadedPodcast")) {
          document
            .querySelector(".loadedPodcast")
            .classList.remove("loadedPodcast");
        }
        target.classList.add("loadedPodcast");
        console.log("Not fetched yet");
      }
      document.body.classList.add("showPodcastData");
    },
    toggleSubscription(
      e,
      podID,
      podDescription,
      podThumbnail,
      podName,
      isSubscribed,
      genreIndex,
      podcastIndex
    ) {
      if (isSubscribed) {
        this.unSubscribeToPodcast(podID);
        const data = {
          genreIndex,
          podcastIndex,
          action: "unSub"
        };
        this.updateRender(data);
      } else {
        const podcast = {
          podId: podID,
          description: podDescription,
          name: podName,
          thumbnail: podThumbnail
        };
        this.subscribeToPodcast(podcast);
        const data = {
          genreIndex,
          podcastIndex,
          action: "sub"
        };
        this.updateRender(data);
      }
    }
  },
  props: {
    podName: String,
    podID: String,
    podDescription: String,
    podThumbnail: String,
    isSubscribed: Boolean,
    genreIndex: Number,
    podcastIndex: Number
  }
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
  .issubscribed {
    font-weight: 600;
    img {
      margin-left: 115px !important;
    }
    div {
      color: black;
    }
    div:hover {
      background: rgba(
        var(--base-one),
        var(--base-two),
        var(--base-three),
        1
      ) !important;
      color: white;
    }
  }
  .issubscribed:hover {
    width: 130px !important;
    img {
      margin-left: -5px !important;
    }
    div {
      margin-left: -5px;
      margin-right: -8px;
    }
  }
  .expandArrow {
    position: absolute;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.2);
    height: 35px;
    width: 35px;
    top: 5px;
    left: 5px;
    transition: 0.2s ease;
    border-radius: 20px;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    overflow: hidden;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.493);
    div {
      display: flex;
      justify-content: space-between;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-right: 10px;
      padding-left: 5px;
      transition: 0.2s ease;
    }
    div:hover {
      background: rgba(
        var(--base-one),
        var(--base-two),
        var(--base-three),
        0.3
      );
    }
    img {
      width: 18px;
      margin-left: 95px;
      margin-right: 10px;
    }
    p {
      background: black;
    }
  }
  .expandArrow:hover {
    width: 120px;
    div {
      margin-left: -5px;
      margin-right: -12px;
    }
    img {
      margin-left: 0px !important;
    }
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
    background: black;
    opacity: 1;
  }
  .issubscribed {
    background: white !important;
  }
  .thumbnailArea {
    img {
      transform: rotate(2deg) scale(1.03);
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
