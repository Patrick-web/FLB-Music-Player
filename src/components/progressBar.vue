<template>
  <div class="bar">
    <div class="innerBar"></div>
  </div>
</template>

<script>
import * as electron from "electron";

export default {};
</script>

<style lang="scss">
.bar {
  position: fixed;
  z-index: 15;
  top: 50%;
  transform: scale(0) translateY(-50%) rotate(180deg);
  border-radius: 15px;
  overflow: hidden;
  transform-origin: center;
  left: 20px;
  height: 500px;
  width: 50px;
  background: rgb(68, 0, 68);
  .innerBar {
    background: rgb(226, 0, 226);
    height: 0%;
    transition: ease;
  }
}
</style>
