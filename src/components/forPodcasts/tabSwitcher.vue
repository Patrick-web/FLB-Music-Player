<template>
  <div class="vMenu">
    <div class="activeTabIndicator"></div>
    <div @click="switchTab($event, 'subscribed')" class="vmenu-group">
      <img src="@/assets/forPodcasts/DoubleBolt.svg" alt="" />
      <p class="v-tooltip">Subscribed</p>
    </div>
    <div @click="switchTab($event, 'explorer')" class="tabActive vmenu-group">
      <img style="width:38px" src="@/assets/forPodcasts/explore.png" alt="" />
      <p class="v-tooltip">Explore</p>
    </div>
    <div @click="switchTab($event, 'downloaded')" class="vmenu-group">
      <img src="@/assets/forPodcasts/download.svg" alt="" />
      <p class="v-tooltip">Downloaded</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    switchTab(e, tab) {
      const indicator = document.querySelector(".activeTabIndicator");
      const element = e.currentTarget;
      document.querySelector(".tabActive").classList.remove("tabActive");
      element.classList.add("tabActive");
      switch (tab) {
        case "subscribed":
          indicator.style.top = "5%";
          break;
        case "explorer":
          indicator.style.top = "46%";
          break;
        case "downloaded":
          indicator.style.top = "84%";
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.vMenu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 4;
  min-width: 50px;
  .vmenu-group {
    position: relative;
    .v-tooltip {
      position: absolute;
      top: 20%;
      right: -50%;
      transform: scale(0) translate(100%, 0%);
      opacity: 0;
      padding: 5px 10px 5px 10px;
      transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 600;
    }
  }
  .vmenu-group:hover {
    cursor: pointer;
    .v-tooltip {
      opacity: 1;
      transform: scale(1) translate(100%, 0%);
    }
  }
  img {
    width: 35px;
  }
  .activeTabIndicator {
    position: absolute;
    top: 46%;
    left: 110%;
    transition: 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .tabActive {
    .v-tooltip {
      display: none;
    }
  }
}
</style>
