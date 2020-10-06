<template>
  <div class="podControls">
    <div @click="togglePlayState" class="playPodBt">
      <img
        class="playControl podPlay"
        src="@/assets/forPodcasts/triangle.svg"
        alt
      />
      <img
        class="playControl podPause"
        src="@/assets/forPodcasts/pause.svg"
        alt
      />
    </div>
    <div @click="seek($event)" class="seekBar">
      <div class="seekProgress"></div>
      <div class="progressInfoCard">
        <div class="point"></div>
        <div class="progressInfoWrapper">
          <div>
            <span>CurrentTime</span>
            <span>{{ currentTime }}</span>
          </div>
          <div>
            <span>Duration</span>
            <span>{{ episodeDuration }}</span>
          </div>
          <div>
            <span>Hovering at</span>
            <span>{{ hoverTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div @click="seekForward" class="seekWrapper">
      <img
        class="seekBt seekForward"
        src="@/assets/forPodcasts/arrowSeek.svg"
        alt
      />
      <p>30</p>
    </div>
    <div @click="seekBack" class="seekWrapper">
      <img
        class="seekBt seekBack"
        src="@/assets/forPodcasts/arrowSeek.svg"
        alt
      />
      <p>30</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: "00:00:00",
      episodeDuration: "1:15:30",
      hoverTime: "30:59",
    };
  },
  mounted() {
    const progressBar = document.querySelector(".seekBar");
    const progressInfoCard = document.querySelector(".progressInfoCard");
    const audio = document.querySelector("#podcastAudioTag");
    setInterval(() => {
      if (audio.currentTime) {
        this.currentTime = this.timeFormatter(audio.currentTime);
      }
    }, 1000);
    progressBar.addEventListener("mousemove", (e) => {
      const posY = e.clientY - progressBar.getBoundingClientRect().y;
      progressInfoCard.style.top = `${posY}px`;
      this.episodeDuration = this.timeFormatter(audio.duration);

      const percentageSeek = Math.ceil(
        (posY / window.getComputedStyle(progressBar).height.substring(0, 3)) *
          100
      );
      this.hoverTime = this.timeFormatter(
        (percentageSeek * window.episodeDuration) / 100
      );
    });
  },
  methods: {
    togglePlayState() {
      const audio = document.querySelector("#podcastAudioTag");
      document.body.classList.toggle("podcastInPlayingState");
      if (document.body.classList.contains("podcastInPlayingState")) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    seekBack() {
      const audio = document.querySelector("#podcastAudioTag");
      audio.currentTime = audio.currentTime - 30;
    },
    seekForward() {
      const audio = document.querySelector("#podcastAudioTag");
      audio.currentTime = audio.currentTime + 30;
    },
    seek(e) {
      const track = document.querySelector(".seekBar");
      const length = e.clientY - track.getBoundingClientRect().y;
      //   console.log(e.clientY);
      const progress = document.querySelector(".seekProgress");
      if (length > -1 && length <= 900) {
        progress.style.height = length + "px";
      }
      const percentageSeek = Math.ceil(
        (length / window.getComputedStyle(track).height.substring(0, 3)) * 100
      );
      console.log(percentageSeek);

      const audio = document.querySelector("#podcastAudioTag");

      audio.currentTime = (percentageSeek * window.episodeDuration) / 100;

      //   console.log((percentageSeek * window.episodeDuration) / 100);
    },
    timeFormatter(duration) {
      // Hours, minutes and seconds
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    },
  },
};
</script>

<style lang="scss">
.podControls {
  position: absolute;
  z-index: 5;
  left: 0px;
  transform: translateX(-100%);
  height: 100vh;
  width: 30px;
  padding-top: 10px;
  padding-right: 8px;
  background: rgb(
    calc(var(--base-one) - 190),
    var(--base-two),
    calc(var(--base-three) - 175)
  );
  //   box-shadow: -6px 0px 3px rgba(0, 0, 0, 0.247);
}
.seekBar {
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.2);
  min-height: 75%;
  margin: auto;
  margin-bottom: 5px;
  width: 30%;
  position: relative;
  border-radius: 10px;
  .seekProgress {
    position: absolute;
    height: 0%;
    width: 100%;
    background: rgb(var(--base-one), var(--base-two), var(--base-three));
    transition: 0.2s linear;
  }
}
.seekBar:hover {
  cursor: pointer;
  .progressInfoCard {
    transform: scale(1) translateX(100%);
    opacity: 1;
  }
}
.seekWrapper {
  margin-bottom: 5px;
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.3);
  width: 30px;
  height: 60px;
  flex-direction: column;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 20px;
  p {
    margin-top: -3px;
    font-weight: 800;
  }
  img {
    width: 45%;
  }
  .seekForward {
    transform: rotateY(180deg);
  }
}
.seekWrapper:hover {
  cursor: pointer;
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.4);
}
.playPodBt {
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.3);
  height: 28px;
  width: 28px;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: -5px;
  margin-bottom: 5px;
  overflow: hidden;
  .playControl {
    width: 60%;
    margin-left: 2px;
    transition: 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .podPause {
    width: 50%;
    margin-left: 0px;
    margin-bottom: -40px;
    // display: none;
  }
}
.playPodBt:hover {
  cursor: pointer;
}
.podcastInPlayingState {
  .podPause {
    margin-top: 0px;
  }
  .podPlay {
    margin-top: -70px;
  }
}
.progressInfoCard {
  position: absolute;
  right: 0px;
  transform: scale(0) translateX(200%);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  .point {
    width: 0;
    height: 0;
    border-bottom: 15px solid transparent;
    border-right: 15px solid rgb(255, 255, 255);
    margin-right: -1px;
  }
  .progressInfoWrapper {
    background: white;
    border-radius: 10px;
    border-top-left-radius: 0px;
    color: rgba(0, 0, 0, 0.822);
    padding: 5px;
    font-size: 0.8rem;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.623);
    div {
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
      span {
        margin-left: 5px;
        font-weight: 300;
      }
    }
  }
}
</style>
