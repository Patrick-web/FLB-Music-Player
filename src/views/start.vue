<template>
  <div class="startPg animated faster">
    <div class="logoArea">
      <img id="logo" class="animated  pulse delay-1s" src="@/assets/logo.svg" alt="">
      <p id="logoName">Feel The Beat</p>
      <p id="ms">Music Player</p>
    </div>
    <div @click="getIn" class="jamBt animated pulse delay-4s">
      <p>Let's Jam</p>
      <img id="arrow" src="@/assets/arrow.svg" alt="">
    </div>
    <div class="quote"><p>Cause when it hits, it hits HARD!!!</p></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'start',
  components: {
  },
  methods:{
    getIn(){
      document.querySelector('.startPg').classList.add('slideOutDown');
    }
  }
}
</script>
<style lang='scss' scoped>
  .startPg{
    background:black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top:0;left: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .logoArea{
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .logoArea #logoName{
    font-size: 160%;
    margin-top: 10px;
    font-weight: 300;

  }
  .logoArea #ms{
    margin-top: 5px;
    color: rgb(0, 199, 149);
    font-weight: 300;
    font-size: 100%;

  }
  .logoArea p{
    color: rgb(0, 199, 199);
  }
  #logo{
    width:200px;
    animation-iteration-count: 3;
  }
  #arrow{
    transition: 0.2s ease-in-out;
  }
  .jamBt{
    background: linear-gradient(90deg,rgb(0, 238, 255),rgb(0, 153, 255));
    margin: 10px;
    border-radius: 40px;
    color:white;
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
    overflow: hidden;
    margin: auto;
    transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    p{
      font-size: 200%;
      font-weight: 500;
    }
  }
  .jamBt:hover{
      width: 250px;
      cursor: pointer;
      background: transparent;
      border:2px solid magenta;
      #arrow{
        margin-right: -20px;
        margin-left: 20px;
      }
  }
  .quote{
    color: rgb(216, 216, 216);
    margin-bottom: 10px;
    text-align: center;
  }
</style>