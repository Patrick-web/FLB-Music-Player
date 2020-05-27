<template>
  <div class="plAdder">
      <button @click="showPlaylistAdder">New</button>
      <div class="pls">
          <div :key="pl.name" v-for="pl in pls" class="pl">{{pl.name}}</div>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        showPlaylistAdder(){
            document.body.classList.add('showPlaylistAdder');
            document.querySelector('#newPlaylist').focus();
        }
    },
    data(){
        return{
            pls:[
                {
                    name:'Podcast',
                    id:3515
                },
                {
                    name:'Vitoa machozi',
                    id:3515
                },
            ]
        }
    }

}
</script>

<style lang="scss">
.plAdder{
    position: absolute;
    left:-10px;
    bottom: 20px;
    transform: translateX(-100%);
    background: rgb(22, 22, 22);
    font-size: 1.2rem;
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
    button{
        font-size: 1.2rem;
        width: 90%;
        background: rgb(0, 183, 255);
        border:none;
        padding: 5px;
        color: white;
        font-weight: 700;
        margin: 5px;
        border-radius: 5px;
        outline: none;
    }
    button:hover{
        cursor: pointer;
        background: blueviolet;
    }
    button:active{
        background: blueviolet;
    }
    .pl{
        padding: 5px;
        border-bottom: 1px solid gray;
    }
    .pl:hover{
        cursor: pointer;
        background: blueviolet;
    }
}
</style>