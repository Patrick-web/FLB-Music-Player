<template>
  <div @click="resetMixer" class="mixer featurePage">
      <div class="mixingloader">
          <img id="mixLoader" class="animated infinite" src="@/assets/mixing.png" alt="">
          <h2>Mixing...</h2>
      </div>
      <h1>Mix Maker</h1>
      <p @click="closeMixer" id="closeMixer">Close Mixer</p>
    <div class="card-songs">
        <div         
            :key='song.id'
            v-for="(song,index) in songsToMix"
            class="card-song animated fast"
            @click="mix($event,index)"
        >
            <div class="poster">
                <img :src="song.poster" alt="">
            </div>
            
            <p class="song-title">{{song.title}}</p>
            <p class="song-path" style="display:none">{{song.path}}</p>

        </div>
 
    </div>
          <div class="blurDiv"></div>
      <div class="mixerCreator">
          <div class="mixcontrols">
            <div id="mixplayBt" style="padding:10px" @click="create">
                <img style="width:60px" src="@/assets/merge.svg" alt="">
            </div>
          </div>


        <div class="nodeswrapper">

         
          <div
            :key='node.id'
            v-for="(node,index) in selectedToMix"
            class="mixnode animated fast"
          >
              <div class="nodeName">{{node.title}}</div>
              <div class="nodeBlur"></div>
              <div class="removeBt" @click="removeSongFromMix($event,index)">Remove</div>
          </div>

        </div>

      </div>
  </div>
</template>

<script>
import * as electron from 'electron';
import {mapGetters,mapActions} from 'vuex';

export default {
computed:mapGetters(['songsToMix','selectedToMix','songQueue']),
methods:{
    ...mapActions(['addSongToMix','unMix']),
    mix(e,index){
        const card = e.currentTarget;
        card.classList.add('bounceOutDown');
        setTimeout(()=>{
            this.addSongToMix(index)
        },800)
    },
    removeSongFromMix(e,index){
        const node = e.currentTarget.parentElement;
        node.classList.add('zoomOut');
        setTimeout(()=>{
            this.unMix(index);
        },600)
    },
    closeMixer(){
        document.body.classList.remove('showMixer');
        this.resetMixer();
    },
    resetMixer(){
        if(document.body.classList.contains('playingMix')){
            document.body.classList.remove('playingMix');
        }
    },
    seekMix(){
        
    },
    playMix(mix){
        setTimeout(()=>{
            document.querySelector('.card').click();
            document.body.classList.add('playingMix');
            document.body.classList.remove('currentlyMixing');
            document.querySelector('#mixLoader').classList.remove('pulse');
        },100)
    },
    async create(){
        if(this.selectedToMix.length>1){
            document.body.classList.add('currentlyMixing');
            document.querySelector('#mixLoader').classList.add('pulse');
            setTimeout(async ()=>{
                const songPaths = this.selectedToMix.map(song=>song.path);
                const data = await electron.ipcRenderer.sendSync("mixSongs",songPaths);
                console.log(data);

                const mixObj = {
                    id:JSON.stringify(Date.now()),
                    title:'Unsaved Mix',
                    path:data.mixPath,
                    poster:'/img/poster.e5b0f5a2.png',
                    duration:data.mixData.format.duration
                }
                console.log(mixObj);
                this.songQueue.unshift(mixObj);
                return this.playMix();
            },200)
        }else{
            alert('Cannot create mix of less than 2 songs')
        }
    }

},
components:{
},
mounted(){

}
}
</script>

<style lang="scss">
.playingMix{
    .mixer{
        height: 68vh;
    }
    .mixerCreator{
        background: rgb(75, 1, 125) !important;
    }
}
.featurePage{
    h1{ 
        background: #9900FF;
        text-align: center;
        margin:auto;
        padding: 10px;
        width: 15%;
        border-radius: 50px;
        min-width: 200px;
    }
}
.showMixer{
    .mixer{
        transform: translateY(0%);
    }
}
.currentlyMixing{
    .mixingloader{
        transform: scale(1);
    }
}
.mixingloader{
    position: fixed;
    top:0;
    left:0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(180deg,purple,rgb(59, 0, 59));
    opacity: 0.9;
    z-index: 12;
    display: flex;
    flex-direction: column;;
    justify-content: space-evenly;
    align-items: center;
    font-size: 3em;
    color: magenta;
    transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(0);
}

.mixer{
    background: #1C002F;
    height: 100vh;
    padding-top: 10px;
    position: fixed;
    top:0;
    transform: translateY(-100%);
    transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 12;
    overflow: hidden;
    .card-songs{
        position: relative;
        margin-top: 10px;
        width: 100vw;
        display: grid;
        grid-template-columns:  1fr 1fr 1fr;
        max-height: 450px;
        overflow-y: scroll;
        // padding-left: 50px;
        .card-song{
            justify-self: center;
            width: 400px;
            background: #310051;
            position: relative;
            margin: 20px;
            padding:10px;
            min-height: 75px;
            width:300px;
            border-radius: 10px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.308);
            display: flex;
            align-items: center;
            .song-title{
                text-align: left;
                margin-left: 10px;
            }
            img{
                width:70px;
                box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.74);
                transform: scale(1);
                transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
        }
        .card-song:hover{
            cursor:pointer;
            background: lighten($color: #310051, $amount: 10);
            img{
                transform: scale(1.05);
            }
        }
    }
        .blurDiv{
            transform: translateY(-100%);
            margin:0;
            height: 80px;
            width: 100%;
            background: linear-gradient(180deg,rgba(20, 0, 31, 0.103),rgba(20, 0, 31, 0.747));
            filter: blur(5px);
            pointer-events: none;
        }
    .mixerCreator{
        background: rgba(153, 0, 255, 0.247);
        position: absolute;
        bottom: 0%;
        width: 100%;
        height: 180px;
        .nodeswrapper{
            display: flex;
            width: 100vw;
            overflow-x: scroll;
            position: absolute;
            bottom:2px;
            padding-bottom: 50px;
        }
        .mixnode{
            background: #9900FF;
            min-width: 200px;
            max-width: 200px;
            height: 20px;
            margin: 10px;
            border-radius: 50px;
            padding:5px 10px 10px 5px;
            position: relative;
            overflow: hidden;
            .nodeName{
                position: absolute;
                top:50%;
                left:10px;
                transform: translateY(-50%);
                min-width: 1000px;
                transition: 10s ease-in-out;
            }
            .nodeBlur{
                position: absolute;
                top:50%;
                transform: translateY(-50%);
                height: 50px;
                width: 50px;
                right: -5px;
                background: linear-gradient(90deg,rgba(118, 0, 148, 0.5),rgba(111, 0, 139, 0.897),rgb(107, 1, 134));
                filter: blur(5px);
                // border-radius: 20px;
            }
            .removeBt{
                background: white;
                color: rgb(255, 0, 119);
                height: 30px;
                position: absolute;
                right:0px;
                padding: 5px;
                padding-top: 15px;
                font-weight: 900;
                top:50%;
                transform: translateY(-50%) scaleX(0);
                transform-origin: right;
                transition: 0.2s;
            }
            .removeBt:hover{
                background: rgb(255, 0, 119);
                color: white;
            }
        }

        .mixnode:hover{
            cursor: pointer;
            .nodeName{
                left:-800px;
            }
            .removeBt{
                transform: translateY(-50%) scaleX(1);
            }
        }
        .mixcontrols{
            position: relative;
            #mixplayBt{
                box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.616);
                position: absolute;
                top:-35px;
                left:48%;
                transform: translateX(-50%,-50%);
                background: #2E004C;
                border-radius:10px;
                padding: 5px;
            }
            #mixplayBt:hover{
                cursor: pointer;
                background: lighten($color: #2E004C, $amount: 5);
            }
        }
    }
}

#mixprogressBar {
  -webkit-appearance: none;
  margin: 18px 0;
  margin-top: 60px;
  margin-left: 40px;
  width: 95%;
  border-radius: 20px;
}
#mixprogressBar:focus {
  outline: none;
}
#mixprogressBar::-webkit-slider-runnable-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: linear-gradient(90deg,#00FFFF,#CEEFFF);
  border-radius: 40px;
}
#mixprogressBar::-webkit-slider-thumb {
  box-shadow: 1px 1px 10px #000000;
  height: 20px;
  width: 5px;
  border-radius: 10px;
  background: linear-gradient(45deg,rgb(0, 89, 255),#00FFFF);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}
#mixprogressBar::-webkit-slider-thumb:hover {
  cursor: e-resize;
}
#closeMixer{
    position: absolute;
    top:25px;
    right: 10px;
    background: white;
    font-weight: 900;
    color: rgb(255, 0, 140);
    padding: 5px 10px 5px 10px;
    border-radius: 20px;
}
#closeMixer:hover{
    background: rgb(255, 0, 140);
    color: white;
    cursor: pointer;
}

</style>