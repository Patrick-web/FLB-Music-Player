<template>
  <div class="view podcasts">
    <TabSwitcher />
    <div class="contentView">
      <Titlebar />
      <div class="cards">
        <div v-for="data in samplePods" :key="data.podName" class="cardWrapper">
          <Scard :podName="data.podName" :podDescription="data.desc" />
        </div>
      </div>
    </div>
    <div class="sidePane"></div>
  </div>
</template>
<script>
import TabSwitcher from "@/components/forPodcasts/tabSwitcher";
import Titlebar from "@/components/forPodcasts/titlebar.vue";
import Scard from "@/components/forPodcasts/SquareCard.vue";
export default {
  data() {
    return {
      samplePods: [
        {
          podName: "Syntax.fm",
          desc: "Too lazy to write anything relevant",
        },
        {
          podName: "CodeNewBie",
          desc: "Too lazy to write anything relevant",
        },
        {
          podName: "StackOverFlow",
          desc: "Too lazy to write anything relevant",
        },
      ],
    };
  },
  components: {
    TabSwitcher,
    Titlebar,
    Scard,
  },
};
</script>

<style>
.podcasts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
}
.cards {
  /* background: white; */
  height: 90vh;
  width: 850px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 30px;
  column-gap: 30px;
  padding-left: 20px;
}
.sidePane {
  background: rgba(230, 230, 250, 0.089);
  width: 300px;
  height: 100vh;
}
</style>
