<template>
  <div class="playlistCont">
        <playform/>
        <!-- <editform/> -->
      <div id="title">Playlists</div>
      <div :key='playList.id' v-for="playList in playLists" class="playList">
        <div class="playlist-name">
            <p class="pl-name">{{playList.name}}</p>
            <div class="options">
                <!-- <img src="@/assets/playBtFull.png" id="playList" alt=""> -->
                <img src="@/assets/pen.png" @click="pinSongs($event)" alt="">
                <img src="@/assets/trash.png" alt="">
            </div>
        </div>
          <div class="playlist-Songs">
              <div :key='song.title' v-for="song in playList.songs" class="songName">{{song.title}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import playform from '@/components/playlistForm.vue'
import editform from '@/components/editPlaylist.vue'
export default {
    components:{
        playform,
        editform
    },
        data(){
            return{
            playLists:[
                {
                    name:'Podcasts',
                    id:Date.now(),
                    songs:[
                        {
                            title:'Syntax show 200',
                            sourcepath:'pathTofile',
                            poster:'pathToPoster'
                        }
                    ]
                }
            ]
        }},
    methods:{
        pinSongs(e){
            if(document.querySelector('.fixThePlaylist')){
                document.querySelector('.fixThePlaylist').classList.remove('fixThePlaylist');
            }
            const playList = e.target.parentElement.parentElement.parentElement
            playList.classList.add('fixThePlaylist')
        }
    }
}
</script>

<style lang="scss">
.playListEditBox{
    position: fixed;
    width: 500px;
    left:50%;
    top:10px;
    transform: translateX(50%);
    z-index: 5;
    button{
        padding:5px;
        background: rgba(255, 0, 0, 0.274);
        color: white;
        font-size: 1.2em;
        font-weight: 500;
        border:none;
    }
}


.playlistCont{
    position: absolute;
    z-index: 4;
    top:10px;
    border-radius: 10px;
    width: 100%;
    background: linear-gradient(150deg,rgba(20, 20, 20, 0.452),rgb(32, 32, 32));
    padding-bottom: 8px;
    #title{
        background: white;
        color: rgba(0, 0, 0, 0.863);
        font-weight: 800;
        font-size: 2em;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        margin-bottom:5px;
    }
}
.playList{
    padding: 5px;
    font-size: 1.2em;
    position: relative;
    .playlist-name{
        border: 2px solid white;
        padding: 5px;
        padding-left: 10px;
        border-radius: 30px;
        background: rgba(255, 255, 255, 0);
        transition: ease-in-out;
        .options{
            display: none;
            // display: flex;
            // margin-top: -20px;
            margin-left: -3px;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            img{
                width: 30px;
                transition: 0.2s ease-in-out;
            }
        }
    }
    .playlist-name:hover{
        .options{
            display: flex;
            img:hover{
                transform: scale(1.15);
            }
        }
        // background: rgba(255, 255, 255, 0.534);
        // color: rgba(2, 45, 65, 0.863);
        cursor: pointer;
        font-weight: 600;    
        border-radius: 5px;
    }
    .playlist-Songs{
        width:400px ;
        background: rgba(1, 182, 206, 0.151);
        position: absolute;
        top:0;
        right: 0;
        border-radius: 10px;
        transform: translateX(0%) scale(0);
        opacity: 0;
        transition: 0.3s ease-in-out;
        .songName{
        border-bottom: 2px solid rgba(15, 99, 124, 0.562);
        padding: 5px;
        padding-left: 10px;
        margin: 5px;
        transition: ease-in-out;
        color: rgb(255, 255, 255);
    }
    }
}
.playList:hover{
    .playlist-Songs{
        opacity: 1;
        transform: translateX(110%) scale(1);
    }
}
.fixThePlaylist{
    .playlist-name{
        background: white;
        color: rgb(0, 85, 124);
        font-weight: 600;
    }
    .playlist-Songs{
        opacity: 1;
        transform: translateX(110%) scale(1);
    }
    .options{
        display: none;
    }
}


#playList{
    width: 60px;
}

</style>