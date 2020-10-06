<template>
  <div class="PodcastPage">
    <img
      class="hidePodcastPage"
      @click="hidePodcastPage"
      src="@/assets/forPodcasts/arrow.svg"
      alt=""
    />

    <div class="thumbnailView">
      <img class="blurredBg" :src="currentPodcast.thumbnail" alt="" />
      <img class="podLogo" :src="currentPodcast.thumbnail" alt="" />
      <p class="podname">{{ currentPodcast.name }}</p>
    </div>
    <div class="podData">
      <div class="episodesCont">
        <div
          v-for="episode in currentPodcast.episodes"
          :key="episode.id"
          class="episodeCard"
          @click="playEpisode($event, episode)"
        >
          <p class="episodeTitle">
            {{ episode.title }}
          </p>
          <div class="eControls">
            <div class="btns">
              <div class="eBt">
                <img src="@/assets/forPodcasts/triangle.svg" alt="" />
              </div>
              <div class="eBt">
                <img src="@/assets/forPodcasts/download.svg" alt="" />
              </div>
            </div>
            <p class="eDuration">{{ episode.formattedDuration }}</p>
          </div>
        </div>
      </div>
      <div class="podCastInfo">
        <div class="infoGroup">
          <h4 class="pill">Publisher</h4>
          <p class="pill">{{ currentPodcast.publisher }}</p>
        </div>
        <div class="infoGroup">
          <h4 class="pill">Website</h4>
          <p class="pill">
            {{ currentPodcast.website }}
          </p>
        </div>
        <div class="infoGroup">
          <h4 class="pill">Description</h4>
          <p class="pill">
            {{ currentPodcast.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: mapGetters(["currentPodcast"]),
  methods: {
    ...mapActions(["updatePlayingEpisode"]),
    playEpisode(e, episode) {
      this.updatePlayingEpisode(episode);
      this.markAsPlaying(e.currentTarget);
      setTimeout(() => {
        const audio = document.querySelector("#podcastAudioTag");
        console.log(audio);
        audio.src = episode.audio;
        audio.play();
        window.episodeDuration = episode.audio_length_sec;
        console.log(episode.audio_length_sec);
      }, 100);
    },
    markAsPlaying(element) {
      document.body.classList.add("episodeIsPlaying");
      document.body.classList.add("podcastInPlayingState");
      if (document.querySelector(".playingPane")) {
        document.querySelector(".playingPane").classList.add("slideInRight");
      }

      if (document.querySelector(".playingEpisode")) {
        document
          .querySelector(".playingEpisode")
          .classList.remove("playingEpisode");
      }
      element.classList.add("playingEpisode");
    },
    hidePodcastPage() {
      document.body.classList.toggle("showPodcastData");
    },
  },
  mounted() {
    const episodesCont = document.querySelector(".episodesCont");
    let scrollAmount = 0;
    episodesCont.addEventListener("scroll", (e) => {
      //   console.log(e.srcElement.scrollTop);
      if (e.srcElement.scrollTop > 750) {
        // console.log("Fetch More Episodes");
      }
    });
  },
};
</script>

<style lang="scss">
.fetchingInProgress .episodeCard {
  cursor: wait !important;
}
.showPodcastData {
  .PodcastPage {
    top: 0%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    .hidePodcastPage {
      top: 10px;
      transform: rotate(0deg) translateX(-50%);
    }
  }
}
.PodcastPage {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: absolute;
  top: 95%;
  z-index: 7;
  height: 100vh;
  width: 100%;
  background: rgba(
    calc(var(--base-one) - 190),
    var(--base-two),
    calc(var(--base-three) - 175),
    1
  );
  overflow: hidden;
  transition: 0.4s ease;
  .hidePodcastPage {
    position: absolute;
    z-index: 5;
    top: 5px;
    left: 50%;
    transform: rotate(180deg) translateX(-0%);
    width: 30px;
    transition: 0.2s linear;
  }
  .hidePodcastPage:hover {
    cursor: pointer;
  }
  .podname {
    width: 99.5%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.562));
    position: absolute;
    z-index: 3;
    bottom: 0px;
    left: 0px;
    padding-left: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    font-size: 1.8rem;
    font-weight: 600;
    color: white;
  }
  .podData {
    height: 57.5%;
    display: flex;
    background: rgba(
      calc(var(--base-one) - 180),
      var(--base-two),
      calc(var(--base-three) - 175),
      1
    );
    overflow: hidden;
    padding-bottom: 10px;
  }
  .podCastInfo {
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.08);
    padding: 10px;
    padding-top: 0px;
    height: 90%;
    width: 30.5%;
    border-radius: 10px;
    margin-left: 15px;
    margin-top: 20px;
    overflow-y: scroll;
    .infoGroup {
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
      border-bottom: 2px solid
        rgba(var(--base-one), var(--base-two), var(--base-three), 0.2);
      .pill {
        max-width: 100%;
        max-height: 300px;
      }
      h4 {
        font-size: 1.2rem;
      }
      p {
        font-weight: 400;
        margin-top: 5px;
      }
    }
  }
  .episodesCont {
    width: 65%;
    padding-top: 20px;
    height: 100%;
    overflow-y: scroll;
  }
  .episodeCard {
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.08);
    width: 96%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    border-top: 0px solid
      rgb(var(--base-one), var(--base-two), var(--base-three));
    border-bottom: 0px solid
      rgb(var(--base-one), var(--base-two), var(--base-three));
    transition: 0.2s ease;
    .episodeTitle {
      padding: 10px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .eDuration {
      font-weight: 500;
    }
    .eControls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px;
      .btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 20%;
        .eBt {
          background: rgba(
            var(--base-one),
            var(--base-two),
            var(--base-three),
            0.15
          );
          padding: 2px;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 50%;
          }
        }
        .eBt:hover {
          background: rgba(
            var(--base-one),
            var(--base-two),
            var(--base-three),
            0.3
          );
          cursor: pointer;
        }
      }
    }
  }
  .episodeCard:hover {
    cursor: pointer;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
  }
  .playingEpisode {
    border-top: 5px solid
      rgb(var(--base-one), var(--base-two), var(--base-three));
    border-bottom: 5px solid
      rgb(var(--base-one), var(--base-two), var(--base-three));
    border-radius: 20px;
  }
  .thumbnailView {
    height: 300px;
    width: 100%;
    background: rgba(255, 255, 255, 0.062);
    position: relative;
    overflow: hidden;
    .blurredBg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(30px);
    }
    .podLogo {
      width: 25%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
