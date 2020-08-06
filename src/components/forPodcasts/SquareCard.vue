<template>
  <div class="squareCard">
    <div class="thumbnailArea"></div>
    <div class="cardInfo">
      <div class="infoTitle">{{ podName }}</div>
      <div class="infoContent">{{ podDescription }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    podName: String,
    podDescription: String,
    podThumbnail: String,
  },
};
</script>

<style lang="scss">
.squareCard {
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
  border-radius: 10px;
  width: 250px;
  .thumbnailArea {
    height: 150px;
  }
  .cardInfo {
    padding: 8px;
    .infoTitle {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .infoContent {
      font-size: 1.1rem;
      font-weight: 300;
    }
  }
}
.squareCard:hover {
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.25);
  cursor: pointer;
}
</style>
