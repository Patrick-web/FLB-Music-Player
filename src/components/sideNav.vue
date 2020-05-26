<template>
  <div class="sideNav animated faster">
      <img src="@/assets/collapseSidenav.svg" @click="collapse" alt="" id="colapseNav">
      <div class="showcase">
          <img id="logo" src="@/assets/logo.svg" alt="">
          <div class="appName">
              <p id="name">Feel the Beat</p>
              <p class="msc">Music Player</p>
          </div>
      </div>
      <div class="options">
          <div class="addSong">
              <input id="audioInput"  type="file">
              <img src="@/assets/folder.png" alt="">
              <p>Add Music Folder</p>
          </div>
          <div class="refresh">
              <img src="@/assets/microscope.png" alt="">
              <p>Refresh Music</p>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        collapse(){
            document.querySelector('.sideNav').classList.add('slideOutLeft');
        },
    },
    mounted(){
            const inputElement = document.getElementById("audioInput");
            inputElement.addEventListener("change", handleFiles, false);
            function handleFiles() {
            let songs = [];
            this.files.forEach(song=>{
                songs.push(URL.createObjectURL(song))
            })
            console.log(songs);
            } 
    }
}
</script>

<style lang="scss">
.sideNav{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100vh;
    #logo{
        padding-top: 20px;
        width: 150px;
    }
    #colapseNav{
        position: absolute;
        top:-5px;
        left:-5px;
        width: 50px;
    }
    .showcase{
        padding-bottom: 20px;
        background: rgb(0, 0, 0);
        border-bottom: 6px solid #00FFFF;
        text-align: center;
        border-radius: 0px 0px 30px 30px;
    }
}
.appName{
    text-align: center;
    color: #00FFFF;
    #name{
        font-size: 2em;
        font-weight: 900;
    }
    .msc{
        padding: 10px;
        font-family: 1.4em;
        font-weight: 400;
    }
}
.options{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 25px;
    height: 100%;
    div{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
        position: relative;
        width: 150px;
        border-radius: 0px 10px 0px 0px;
        p{
            font-size: 1.3em;
            font-weight: 300;
            color: white;
            margin-top: -80px;
        }
        input{
            position: absolute;
            top:0;
            left: 10px;
            height: 100%;
            width: 150px;
            opacity: 0;
        }
        img{
            width:100px;
            position: absolute;
            top:30%;left:50%;
            transform: translate(-50%,-50%);
        }
    }

}
input:hover{
    cursor: pointer;
}
</style>