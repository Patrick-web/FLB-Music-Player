<template>
  <div @click="seek($event)" v class="progressLine">
    <div class="progress"></div>
    <div class="pointer"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: mapGetters(["getTrackPosition"]),
  methods: {
    ...mapActions(["updateTrackPosition"]),
    seek(e) {
      const track = document.querySelector(".progressLine");
      const width = e.clientX - track.getBoundingClientRect().x;
      this.updatePositions(width);
    },
    updatePositions(width) {
      const progress = document.querySelector(".progress");
      const pointer = document.querySelector(".pointer");
      if (width > -1 && width <= 900) {
        progress.style.width = width + "px";
        this.updateTrackPosition(width);
        pointer.style.left = width + "px";
      }
    },
  },
  mounted() {
    const track = document.querySelector(".progressLine");
    const pointer = document.querySelector(".pointer");
    const progress = document.querySelector(".progress");
    const maxLength = parseInt(
      window
        .getComputedStyle(track)
        .getPropertyValue("width")
        .replace(/px/, "")
    );
    console.log(maxLength);
    const startX = track.getBoundingClientRect().x;
    track.addEventListener("drag", (e) => {
      const width = e.clientX - startX;
      this.updatePositions(width);
    });
    pointer.addEventListener("drag", (e) => {
      const width = e.clientX - startX;
      this.updatePositions(width);
    });
  },
};
</script>

<style lang="scss">
.progressLine {
  background: rgb(103, 0, 151);
  height: 5px;
  transition: 0.1s ease;
  position: relative;
  max-width: 900px;
  .progress {
    background: magenta;
    height: 100%;
    width: 0px;
    transition: 0.1s linear;
  }
}
.progressLine:hover {
  cursor: pointer;
  height: 10px;
}
.pointer {
  position: absolute;
  top: 0;
  left: 0px;
  transform: translateY(-100%);
  transition: 0.1s linear;
  width: 0;
  height: 0;
  border-right: 25px solid transparent;
  border-top: 30px solid magenta;
}
</style>
