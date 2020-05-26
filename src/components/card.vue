<template>
  <div class="card" v-on:click="playSong($event)">
      <p style="display:none" class="songPath">{{path}}</p>
      <p style="display:none" class="posterPath">{{poster}}</p>
      <p style="display:none" class="songDuration">{{duration}}</p>
        <div class="poster">
        <img :src="poster" alt="">   
        </div>
      <div class="cardBody">
          <div class="songTitle">
              {{songTitle}} 
          </div>
          <div id="waveform"></div>
          <!-- <div class="songDuration">{{duration}}</div> -->
          <div class="actions">
              <button class="sword addToQueue">Play Next</button>
              <button class="sword playNext">Remove</button>
          </div>
      </div>
  </div>
</template>

<script>
import * as visualiser from '@/assets/visualise.js'

export default {
    data(){
        return{
            scroll:100
        }
    },
    methods:{
        createWav(target){
            var wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: 'violet',
                progressColor: 'purple'
            });
        },
        resetProgress(){
            const bar = document.querySelector('#progressBar');
            const audio = document.querySelector('#myAudio');
            console.dir(audio);
            console.log(audio.duration)
            bar.value = 0;
            this.updateProgress()
        },
        updateProgress(){
            setInterval(() => {
                const bar = document.querySelector('#progressBar');
                const audio = document.querySelector('#myAudio');
                bar.value = audio.currentTime;
                if(audio.currentTime === audio.duration){
                    this.playNext(audio)
                }
                // console.log(bar.value);
                // console.log(audio.currentTime);

            }, 700);
        },
        playNext(audio){
            const nextSong = document.querySelector('.playing').nextSibling;
           if(nextSong){
           const nextSongPath = nextSong.querySelector('.songPath').textContent;
            console.log(audio.loop);
            if(audio.loop === false){
                audio.src = 'file://' +  nextSongPath;
                console.log(audio.src);
                const playPromise = audio.play();
                playPromise.then(_ => {}).catch(error => {console.log(error);});

                const posterSrc = nextSong.querySelector('.posterPath').textContent;
                const songName = nextSong.querySelector('.songTitle').textContent;
                const songDuration = nextSong.querySelector('.songDuration').textContent;
                document.querySelector('#songPoster').src = posterSrc;
                document.querySelector('#playingTitle').textContent = songName;
                if(songDuration == false){
                    setTimeout(()=>{
                    document.querySelector('#progressBar').max = audio.duration;
                    console.log("Duration not initially Set");
                    console.log(audio.duration);
                    console.log(document.querySelector('#progressBar').max);

                    },300)
                }else{
                    document.querySelector('#progressBar').max = songDuration;
                    console.log("Duration initial value used");
                }
            document.querySelector('.playing').classList.remove('playing');
            nextSong.classList.add('playing');
            document.querySelector('.tracksView').scrollBy(0,100);
            }
           }
        },
        playSong(e){
            const card = e.currentTarget;
            document.body.classList.add('playingSong');
            this.resetProgress()
            if(document.querySelector('.playing')){
                document.querySelector('.playing').classList.remove('playing');
            }
            card.classList.add('playing');
            const songSrc = 'file://' + card.querySelector('.songPath').textContent;
            const posterSrc = card.querySelector('.posterPath').textContent;
            const songName = card.querySelector('.songTitle').textContent;
            const songDuration = card.querySelector('.songDuration').textContent;
            const audio = document.querySelector('#myAudio');
            audio.src = songSrc;
            document.querySelector('#songPoster').src = posterSrc;
            document.querySelector('#playingTitle').textContent = songName;
            if(songDuration == false){
                setTimeout(()=>{
                document.querySelector('#progressBar').max = audio.duration;
                console.log("Duration not initially Set");
                console.log(audio.duration);
                console.log(document.querySelector('#progressBar').max);

                },300)
            }else{
                document.querySelector('#progressBar').max = songDuration;
                console.log("Duration initial value used");
            }
            console.log(audio.play());
            const playPromise = audio.play();
                playPromise.then(_ => {

                })
                .catch(error => {

                });
            visualiser.startVisualizer();

                    const out = document.querySelector('#out');
                    const canvas = out.querySelector('canvas');
                    canvas.style.transform="scale(0.8)";
                    canvas.style.marginTop="-80px";

        },

    },
    mounted(){
        // window.addEventListener('keypress',(e)=>{
        //     const audio = document.querySelector('#myAudio');
        //     if(e.key === 'n'){
        //         this.playNext(audio)
        //     }
        // })
    },
    props:{
        songTitle:String,
        path:String,
        poster:String,
        duration:Number
    }
}
</script>

<style lang="scss">
    .k-card{
        display: flex;
        justify-content: flex-end;
        width: 90%;
    }
    .card{
        width: 85%;
        border-radius: 10px 0px 0px 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin-top: 10px;
        background: linear-gradient(90deg,rgba(0, 62, 155, 0.295),rgba(0, 217, 255, 0.062));
        display: flex;
        .poster{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: -10%;
            margin-top: 5px;
            transform: scale(1);
            transition: 0.2s ease-in-out;
            width: 70px;
            height: 85px;
            img{ 
                width: 70px;
            }
        }
        .cardBody{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .songTitle{
                padding: 10px;
                color: white;
            }
            .songDuration{
                padding-left: 10px;
                color: white;  
            }
            .actions{
                button{
                    margin: 10px;
                    outline: none;
                    border:none;
                    padding: 5px;
                    color: white;
                    font-weight: 300;
                    background: rgba(255, 255, 255, 0.116);
                }
            }
        }
    }
    .card:hover{
        background: linear-gradient(90deg,rgba(128, 0, 128, 0.452),rgba(255, 166, 0, 0.445));
        cursor: pointer;
        .poster{
            img{
                border-radius: 10px;
                border:2px solid white;
            }
        }
    }
    .playing{
        background: linear-gradient(90deg,rgba(128, 0, 128, 0.452),rgba(255, 166, 0, 0.445));
        cursor: default;
        .actions{
            display: none;
        }
        .poster{
            img{
                border-radius: 10px 0px 10px 0px;
                border:2px solid white;
            }
        }
    }
    .playing:hover{
        background: linear-gradient(90deg,rgba(128, 0, 128, 0.452),rgba(255, 166, 0, 0.445));
        cursor: default;
        .poster{
            img{
                border-radius: 10px 0px 10px 0px;
                border:2px solid white;
            }
        }
    }
    .sword{
        border-radius: 10px 0px 10px 0px;
        font-size: 15px;
        transition: 0.1s;
    }
    .sword:hover{
        border-radius: 5px;
        cursor: pointer;
    }
</style>