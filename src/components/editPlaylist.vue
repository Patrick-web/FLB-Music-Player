<template>
    <form class="form">
      <label for="">Edit Playlist</label>
      <input type="text">
      <button id="editPlBT">Save</button>
    
    <div class="playListSongs">
        <div class="psong">
            <p> Nouvelle Lune - AWN [Vlog No Copyright Music] </p>
            <div class="removeBt">
                <p>Remove</p>
                <img src="@/assets/trash.png" alt="">
            </div>
        </div>
  
    </div>
    </form>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.form{
    overflow-y: scroll;
    max-height: 500px;
    max-width: 500px;
    #editPlBT{
        width: 220px;
    }
}
.playListSongs{
    padding: 2px;
    .psong{
        background: rgba(255, 255, 255, 0.041);
        padding: 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.39);
    }
    .removeBt{
        margin-top: 5px;
        display: block;
        background: rgba(255, 53, 53, 0.205);
        width: 100px;
        display: flex;
        padding: 2px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
        padding-right: 5px;
        align-items: center;
        justify-content: space-between;
        border-radius: 5px;
        img{
            width: 22px;
            height: 22px;
            transition: 0.2s;
        }
    }
    .removeBt:hover{
        cursor: pointer;
        img{
            width: 27px;
            height: 27px;
            cursor: pointer;
        }
    }
}

</style>