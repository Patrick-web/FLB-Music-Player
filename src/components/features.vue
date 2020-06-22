<template>
  <div class="features">
    <h1 style="position:absolute;top:5px;left:50%;transform:translateX(-50%)">
      Cool Stuff
    </h1>
    <div @click="showConverter" id="convert" class="feature">
      <img src="@/assets/convert.svg" alt="" />
      <p class="featur-name">Video to Mp3</p>
    </div>
    <div id="merge" @click="showMixer" class="feature">
      <img src="@/assets/merge.svg" alt="" />
      <p class="featur-name">Create Mix</p>
    </div>
    <div @click="showLyricCoverter" id="lyrics" class="feature">
      <img src="@/assets/lyrics.svg" alt="" />
      <p class="featur-name">Lyrics Maker</p>
    </div>
    <div style="width:100%;height:0;position:relative">
      <img
        @click="hideFeatures"
        id="hideFeatures"
        src="@/assets/x.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    hideFeatures() {
      document.body.classList.remove("showFeatures");
    },
    showMixer() {
      this.hideFeatures();
      document.body.classList.add("showMixer");
    },
    showConverter() {
      document.body.classList.add("showConverter");
      this.hideFeatures();
    },
    showLyricCoverter() {
      document.querySelector("#lyrics").classList.add("soon");
      setTimeout(() => {
        document.querySelector("#lyrics").classList.remove("soon");
      }, 2000);
    },
  },
};
</script>
<style lang="scss">
.showFeatures {
  .features {
    transform: scaleY(1);
  }
  #stars {
    transform: scale(0) !important;
  }
}
.features {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #171717;
  padding: 10px;
  padding-top: 50px;
  border-radius: 0px 0px 50px 50px;
  transform: scaleY(0);
  transform-origin: top;
  transform-style: preserve-3d;
  transition: 0.2s ease;
  position: relative;
  z-index: 5;
  .feature {
    justify-self: center;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 10px;
    border-radius: 20px;
    p {
      margin-top: 10px;
      background: linear-gradient(90deg, #9900ff, #ff00ff);
      padding: 5px 10px 5px 10px;
      border-radius: 20px;
    }
  }
  .feature:hover {
    background: rgb(0, 0, 0);
    cursor: pointer;
  }
}
#convert {
  img {
    width: 150px;
  }
}
#lyrics {
  position: relative;
  img {
    width: 80px;
  }
}
#lyrics::before {
  position: absolute;
  content: "Coming Soon";
  background: rgb(255, 153, 0);
  color: rgb(255, 255, 255);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 20px;
  top: -20px;
  transform: scale(0);
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.soon::before {
  transform: scale(1) !important;
}
#hideFeatures {
  position: absolute;
  left: 142%;
  bottom: -50px;
  background: rgba(255, 0, 0, 0.425);
  padding: 5px;
  z-index: 8;
  border-radius: 50%;
}
#hideFeatures:hover {
  cursor: pointer;
}
</style>
