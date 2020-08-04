<template>
  <div class="lyricsMaker featurePage">
    <div class="pageWraapper">
      <SideControls />
      <div class="centerArea">
        <PreviewArea />
        <Timeline />
      </div>
      <Menu />
    </div>
  </div>
</template>

<script>
import Timeline from "@/components/forLyricsMaker/Timeline.vue";
import PreviewArea from "@/components/forLyricsMaker/Preview.vue";
import SideControls from "@/components/forLyricsMaker/SideControls.vue";
import Menu from "@/components/forLyricsMaker/Menu.vue";
export default {
  components: {
    SideControls,
    Menu,
    Timeline,
    PreviewArea,
  },
};
</script>

<style>
.lyricsMaker {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0%;
  z-index: 10;
  background: var(--base_bg);
}
.pageWrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.centerArea {
  position: absolute;
  left: 100px;
  top: 0px;
  height: 100vh;
  width: 900px;
  display: flex;
  flex-direction: column;
}
</style>
