<template>
  <div class="card" v-on:click="playSong($event)">
      <p style="display:none" class="songPath">{{path}}</p>
      <p style="display:none" class="posterPath">{{poster}}</p>
      <p style="display:none" class="songDuration">{{duration}}</p>
      <p style="display:none" class="songID">{{id}}</p>
      <p style="display:none" class="songIndex">{{index}}</p>
        <div class="poster">
        <img :src="poster" alt="">   
        </div>
      <div class="cardBody">
          <div class="songTitle">
              {{songTitle}} 
          </div>
          <!-- <div class="songDuration">{{duration}}</div> -->
          <div class="actions">
              <button @click.stop='mustPlayNext($event)' class="sword addToQueue">Play Next</button>
              <button @click.stop='removeFromQueue($event)' class="sword playNext">Remove</button>
          </div>
      </div>
  </div>
</template>

<script>
import * as electron from 'electron';
import * as visualiser from '@/assets/visualise.js'
import {mapActions,mapGetters} from 'vuex';

export default {
    data(){
        return{
            scroll:100
        }
    },
    computed:mapGetters(['recents']),
    methods:{
        ...mapActions(['removeSongFromQueue','addToRecents']),
        saveRecentSongs(){
            const json = JSON.stringify(this.recents);
            electron.ipcRenderer.send("saveRecentSongs", json);
        },
        mustPlayNext(e){
            console.log(e.target);
            const nextNode = e.currentTarget.parentElement.parentElement.parentElement;
            nextNode.querySelector('.addToQueue').textContent = 'Playing Next'
            const currentNode = document.querySelector('.playing');
            currentNode.nextSibling.classList.add('toResumedFrom');
            if(document.querySelector('.toPlayNext')){
                document.querySelector('.toPlayNext').classList.remove('toPlayNext');
            }
            nextNode.classList.add('toPlayNext');
            const nextInfo = {
                nextNode,
                currentNode
            }
            window.nextOveride = nextInfo;
            window.hasResumed = false;
        },
        removeFromQueue(e){
            console.log(e.currentTarget);
            const index = parseInt(e.currentTarget.parentElement.parentElement.parentElement.querySelector('.songIndex').textContent);
            console.log(index);
            this.removeSongFromQueue(index)
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
                    if(window.hasResumed == false){
                        this.playNext(true);
                        console.log("Resuming from last stop");
                    }else{
                        this.playNext(false);
                        console.log("Continuing normal behavoir");
                    }
                }
                // console.log(bar.value);
                // console.log(audio.currentTime);

            }, 700);
        },
        playNext(continueNode){
            const audio = document.querySelector('#myAudio');
            let scrollAmount;
            let nextSong;
            if(window.nextOveride){
                scrollAmount = 0;
                nextSong = document.querySelector('.toPlayNext');
                const toPlayNext = document.querySelector('.toPlayNext')
                toPlayNext.querySelector('.addToQueue').textContent = 'Play Next'
                toPlayNext.classList.remove('toPlayNext');
                window.nextOveride = false;
            }else if(continueNode){
                scrollAmount = 0;
                nextSong = document.querySelector('.toResumedFrom');
                window.hasResumed == true
            }
            else{
                nextSong = document.querySelector('.playing').nextSibling;
            }
           if(nextSong){
           const nextSongPath = nextSong.querySelector('.songPath').textContent;
            console.log(audio.loop);
            if(audio.loop === false){
                audio.src = 'file://' +  nextSongPath;
                console.log(audio.src);
                audio.load();
                const playPromise = audio.play();
                playPromise.then(_ => {}).catch(error => {console.log(error);});

                const posterSrc = nextSong.querySelector('.posterPath').textContent;
                const songName = nextSong.querySelector('.songTitle').textContent;
                const songID = nextSong.querySelector('.songID').textContent;
                const songDuration = nextSong.querySelector('.songDuration').textContent;
                document.querySelector('#songPoster').src = posterSrc;
                document.querySelector('#playingTitle').textContent = songName;
                const songIndex = nextSong.querySelector('.songIndex').textContent;
                
                this.addToRecents(songIndex);
                this.saveRecentSongs()
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
            window.currentSong = {
                id:songID,
                title:songName,
                path:nextSongPath,
                poster:posterSrc,
                duration:parseInt(songDuration)
            }
            window.isPlaying = true
            }
           }
        },
        playSong(e){
            if(document.body.classList.contains('hideControls')){
                document.body.classList.remove('hideControls');
            };
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
            const songID = card.querySelector('.songID').textContent;
            const songDuration = card.querySelector('.songDuration').textContent;
            const songIndex = card.querySelector('.songIndex').textContent;
            
            this.addToRecents(songIndex);
            this.saveRecentSongs();

            window.currentSong = {
                id:songID,
                title:songName,
                path:card.querySelector('.songPath').textContent,
                poster:posterSrc,
                duration:parseInt(songDuration)
            }
            const audio = document.querySelector('#myAudio');
            audio.src = songSrc;
            audio.load()
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

            window.isPlaying = true

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
        duration:Number,
        data:Object,
        id:String,
        index:Number
    }
}
</script>

<style lang="scss">
.toPlayNext{
    .addToQueue{
        border-radius: 5px;
        background: fuchsia !important;
        font-weight: 600;
    }
}
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
                width: 100%;
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
            display: none !important;
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