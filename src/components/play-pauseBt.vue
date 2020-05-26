<template>
  <div class="play-pause">
      <div class="topBolts">
          <img class="bolt bolt-left" src="@/assets/bolt.png" alt="">
          <img class="bolt bolt-right" src="@/assets/bolt.png" alt="">
      </div>
      <div class="playbackOpts">
          <img id="playImg" src="@/assets/pause.svg" alt="">
          <img id="pauseImg" src="@/assets/triangle.svg" alt="">
      </div>
      <div class="bottomBolts">
          <img class="bolt bolt-left" src="@/assets/bolt.png" alt="">
          <img class="bolt bolt-right" src="@/assets/bolt.png" alt="">
      </div>
  </div>
</template>

<script>
export default {
    name:'play-pauseBt'
}
</script>

<style lang="scss">
.play-pause{
    border:4px solid #08B5FF;
    background: rgba(0, 0, 0, 0);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    position: relative;
    transform: scale(0.5) translateY(20%);
}
.playbackOpts{
    position: absolute;
    width: 100%;
    top:0%;
    height: 100%;
    // left:50%;
    z-index: 2;
    transform-origin: center;
    transition: 1s ease-in-out;
    #pauseImg{
        position: absolute;
        transform: translate(-50%,-50%) scale(1);
        transition: 0.8s;
        left: 55%;
        top:50%;
    }
    #playImg{
        position: absolute;
        transform: translate(-50%,-50%) scale(0);
        transition: 0.8s;
        left: 50%;
        top:50%;
    }
}
.bolt{
    position: absolute;
    width: 12px;
    transition: 0.2s;
}
.topBolts,.bottomBolts{
    width: 90px;
    height: 30px;
    margin-left: -12px;
    position: relative;
}
.topBolts{
    top:-10px
}
.bottomBolts{
    bottom: -15px;
    transform: rotateZ(-180deg);
}
.bolt-left{
    top:-18px;
    left:-17px;
    transform: rotate(-45deg);
}
.bolt-right{
    top:-18px;
    right:-15px;
    transform: rotate(50deg);    
}
.bolt-left{
    position: absolute;
    left:0px;
}
.bolt-right{
    position: absolute;
    right:0px;
}

@keyframes flash {
    0%{
    }
    100%{
        filter: invert(100%);
    }
}
@keyframes boltInLeft{
    0%{
        top:-18px;
        left:-17px;
    }
    100%{
        top:-5px;
        left: 10px;
    }
}
@keyframes boltInRight{
    0%{
        top:-18px;
        right:-15px;
    }
    100%{
        top:-5px;
        right: 10px;
    }
}
.clicked{
    .bolt-left{
            animation: boltInLeft 0.4s ease-in-out;  
    }
    .bolt-right{
            animation: boltInRight 0.4s ease-in-out;  
    }

}

.playingSong{
    .play-pause{
        #pauseImg{
            transform: scale(0);
            transform: translate(-50%,-50%) scale(0);
            // display: block;
        }
        #playImg{
            transform: scale(1);
            transform: translate(-50%,-50%) scale(1);
            // display: none;
        }
    }
}

</style>