<template>
  <div class="converter featurePage">
      <h1 style="width:250px;">Video to Mp3</h1>
      <p @click="closeConverter" id="closeMixer">Close Converter</p>

      <div class="grid2">
        <div class="functions">
            <div class="buttonn" @click="selectVideo" id="selectVideo">Select Video</div>
            <video id="video" controls src=""></video>
            <div class="buttonn" @click="convert" id="convertVideo">Convert</div>
        </div>
        <div class="converted">
            <div         
                :key='song.id'
                v-for="(song) in converted"
                class="card-song animated fast"
            >
                <div class="poster">
                    <img :src="song.poster" alt="">
                </div>
                
                <p class="song-title">{{song.title}}</p>

            </div>
        </div>
      </div>
  </div>
</template>

<script>
import * as electron from 'electron';

export default {
    data(){return{
        video:null,
        converted:[
            {   id:111,
                title:"Sample song",
                poster:'/img/poster.e5b0f5a2.png'
            },
            {   id:332,
                title:"Sample song",
                poster:'/img/poster.e5b0f5a2.png'
            },
            {   id:3325,
                title:"Sample song",
                poster:'/img/poster.e5b0f5a2.png'
            },
        ]
    }},
    methods:{
        closeConverter(){
            document.body.classList.remove('showConverter');
        },
        selectVideo(){
            let data = electron.ipcRenderer.sendSync("pickVideo");
            this.video = data;
            console.log(this.video);
            console.log(data);
            if(data){
                document.querySelector('#video').src = 'file://' +  data;
            }
        },
        convert(){
            let data = electron.ipcRenderer.sendSync("convertVideoToMp3", this.video);
            console.log(data);

        }
    }
}
</script>

<style lang="scss">
.showConverter{
    .converter{
        transform: translateY(0%);
    }
}
.converter{
    background: #1C002F;
    height: 100vh;
    width: 100vw;
    padding-top: 10px;
    position: fixed;
    top:0;
    transform: translateY(-150%);
    transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 8;

}
.converted{
    padding-top: 10px;
    // background: rgb(240, 240, 240);
    width: 70%;
    min-width: 400px;
    height: 80%;
    margin: auto;
    margin-top: 10px;
    border-radius: 10px;
    img{
        width: 50px;
    }
    .card-song{
        background: rgb(58, 2, 63);
        color: rgb(255, 255, 255);
        display: flex;
        align-items: center;
        width: 80%;
        padding: 10px;
        margin: auto;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
        box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.568);
        p{
            margin-left: 10px;
        }
    }
}
.grid2{
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
}
.functions{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-left: 20px;
}
.buttonn{
    width: 80%;
    text-align: center;
    border-radius: 5px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-top: 60px;
    margin-bottom: 60px;
    font-size: 1.4em;
    font-weight: 900;
    transition: 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.buttonn:hover{
    border-radius: 30px;
    cursor: pointer;
}
#selectVideo{
    background: linear-gradient(90deg,rgb(204, 0, 255),magenta);

}
#convertVideo{
    background: linear-gradient(90deg,orange,magenta);
}
video{
    width: 550px;
}
</style>