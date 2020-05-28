<template>
  <div class="confirm">
      <p id="confirmText">Delete the Podcast Playlist ?</p>
      <div class="choices">
          <button @click="sayYes" id="yes">Yes</button>
          <button @click="sayNo" id="no">No</button>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        sayNo(){
            this.$emit('confirmation','No')
            document.body.classList.remove('showConfirmer');
        },
        sayYes(){
            this.$emit('confirmation','Yes')
            document.body.classList.remove('showConfirmer');
        }
    }
}
</script>

<style lang="scss">
.showConfirmer{
    .confirm{
        transform: scale(1);
    }
}
.confirm{
    position: fixed;
    z-index: 5;
    left:40%;
    top: 40%;
    background: rgb(17, 17, 17);
    color: white;
    font-size: 1.2em;
    padding: 10px;
    border:2px solid gray;
    border-radius: 10px;
    transform: scale(0) translate(-50%,-50%);
    transform-origin: center;
    transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    #confirmText{
        background: rgba(255, 255, 255, 0.068);
        border-left: 4px solid gray;
        margin-bottom: 10px;
        padding: 5px;
    }
    .choices{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        button{
            outline: none;
            border:none;
            padding: 5px;
            font-size: 1.2em;
            color: white;
            border-radius: 20px;
            width: 80px;
            transition: 0.2s;
        }
        button:hover{
            cursor: pointer;
            width: 100px;
        }
        #yes{
             background: rgb(0, 187, 250);
        }
        #no{
            background: rgb(3, 190, 128);
        }
    }
}
</style>