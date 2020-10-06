<template>
  <div class="timeline">
    <ProgressBar />
    <SnippetBlocks />
    <div class="cTime">
      <h4>Current Time</h4>
      <p>3:46</p>
    </div>
  </div>
</template>

<script>
import ProgressBar from "./progressLine";
import SnippetBlocks from "./SnippetBlocks";
export default {
  components: {
    ProgressBar,
    SnippetBlocks,
  },
};
</script>

<style lang="scss">
.cTime {
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
  p {
    margin-left: 5px;
  }
}
</style>
