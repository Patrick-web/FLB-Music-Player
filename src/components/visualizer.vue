<template>
  <div style="z-index:-1" id="content">
    <div id="out"></div>
  </div>
</template>
<script>
import * as visualise from "@/assets/visualise.js";

export default {
  data() {
    return {
      audioFile: songSrc,
      isPlaying: false,
    };
  },
  mounted() {
    // visualise.startVisualizer();
  },
};
</script>

<style lang="scss" scoped>
#out {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -150px;
}
</style>
