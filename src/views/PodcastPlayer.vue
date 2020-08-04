<template>
  <div class="view podcasts">
    <tabSwitcher />
  </div>
</template>
<script>
import tabSwitcher from "@/components/forPodcasts/tabSwitcher";
export default {
  components: {
    tabSwitcher,
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
</style>
