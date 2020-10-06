<template>
  <div class="tabSwitch">
    <div class="activeIndicator"></div>
    <h2 @click="switchToLoaded" class="switch">Loaded</h2>
    <h2 @click="switchToCreated" class="switch">Created</h2>
    <div class="separator"></div>
  </div>
</template>

<script>
export default {
  methods: {
    switchToCreated() {
      document
        .querySelector(".lyricsSideControls")
        .classList.add("active_created");
    },
    switchToLoaded() {
      document
        .querySelector(".lyricsSideControls")
        .classList.remove("active_created");
    },
  },
};
</script>

<style>
.tabSwitch {
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  background: var(--dim_magenta);
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.switch {
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  z-index: 2;
}
.switch:hover {
  cursor: pointer;
}
.active_created .activeIndicator {
  left: 50%;
}
.activeIndicator {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  z-index: 1;
  left: -0.6%;
  background: var(--green);
  border-right: 2px solid white;
  border-left: 2px solid white;
  transition: 0.3s ease;
}
.separator {
  width: 8px;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50.2%;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 3;
}
</style>
