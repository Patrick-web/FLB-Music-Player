<template>
  <div class="loading">
      <img id="loadingImg" class="animated infinite" src="@/assets/musicIcon.png" alt="">
      <p>Adding music</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.loadingNow{
    .loading{
        top:10px;
    }
}
.loading{
    position: fixed;
    left:50%;
    top:-200px;
    transform: translateX(-50%);
    background: #171717;
    border-radius: 20px;
    padding: 10px;
    padding-right: 40px;
    padding-left: 40px;
    text-align: center;
    transition: 0.2s ease-in-out;
    #loadingImg{
        width: 100px;
        margin: auto;
    }
    p{
        font-size: 30px;
    }
}
</style>