<template>
  <form class="form  playlistAdder">
      <label for="">Enter playlist name</label>
      <input id="newPlaylist" type="text">
      <button @click="createAndAdd">Create & Add</button>
  </form>
</template>

<script>
export default {
    methods:{
        createAndAdd(){
            const newPlaylist  = document.querySelector('#newPlaylist').value;
            const songToAdd = window.currentSong;
            const data = [newPlaylist,songToAdd]
            this.$emit('createPlaylist',data);
        }
    }
}
</script>

<style lang='scss'>
    .showPlaylistAdder{
        .playlistAdder{
            top:10px;
        }
    }
    .form{
        transition: 0.2s;
        position: fixed;
        top:-800px;
        left:50%;
        transform: translateX(-50%);
        background: rgb(19, 19, 19);
        text-align: center;
        border-radius: 10px;
        input{
            margin:10px;
            margin-top: 0px;
            font-size: 1.2em;
            padding: 5px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.082);
            outline: none;
            color: white;
            border:2px solid transparent
        }
        input:focus{
            border-radius: 20px;
            border: 2px solid rgba(146, 147, 148, 0.596);
            background: rgba(255, 255, 255, 0);
        }
        button{
            display: block;
            margin: auto;
            margin-bottom: 10px;
            font-size: 1.2em;
            padding: 5px;
            background: rgb(1, 155, 65);
            color: white;
            border:none;
            border-radius: 5px;
            width: 130px;
            transition: 0.2s ease-in-out;
        }
        button:hover{
            width: 140px;
            cursor: pointer;
            background: rgb(0, 133, 104);
            border-radius: 30px;
        }
    }
    label{
        font-size: 1.2em;
        padding: 10px;
        display: block;
    }
</style>