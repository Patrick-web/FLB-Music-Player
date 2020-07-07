<template>
  <form class="form editForm">
    <label for="">Edit Playlist</label>
    <input id="edPlName" class="inputElem" :value="playlist.name" type="text" />
    <p id="edPlIndex" style="display:none">{{ index }}</p>
    <p class="formBtn" @click="saveEdit" id="editPlBT">Save</p>
    <p class="formBtn formBtn-red" @click="hideForm" id="hide">Cancel</p>

    <div class="playListSongs">
      <div
        :key="song.title"
        v-for="song in playlist.songs"
        class="psong animated extrafaster"
      >
        <p>{{ song.title }}</p>
        <div @click="queueToRemove($event, song.id)" class="removeBt">
          <p>Remove</p>
          <img src="@/assets/trash.png" alt="" />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      IDofSongsToRemove: [],
    };
  },
  methods: {
    ...mapActions(["editPlaylist"]),
    queueToRemove(e, id) {
      const target = e.currentTarget.parentElement;
      target.classList.add("fadeOutRight");
      setTimeout(() => {
        target.classList.add("hideMe");
      }, 200);
      this.IDofSongsToRemove.push(id);
    },
    hideForm() {
      document.body.classList.remove("showEditForm");
      const hidden = document.querySelectorAll(".hideMe");
      hidden.forEach((hid) => {
        hid.classList.remove("fadeOutRight");
        hid.classList.remove("hideMe");
      });
    },
    saveEdit() {
      const plIndex = document.querySelector("#edPlIndex").textContent;
      const plName = document.querySelector("#edPlName").value;
      console.log(plName);
      const sTargets = this.IDofSongsToRemove;

      const data = {
        plIndex,
        plName,
        sTargets,
      };
      this.editPlaylist(data);
      document.body.classList.remove("showEditForm");
    },
  },
  props: {
    playlist: Object,
    index: Number,
  },
};
</script>

<style lang="scss">
.hideMe {
  display: none;
}
.showEditForm {
  .editForm {
    transform: scale(1) translate(-50%, -50%);
    top: 40%;
  }
}
.editForm {
  position: fixed;
  top: -100%;
  left: 45%;
  transform: scale(0) translateX(-50%);
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.form {
  overflow-y: scroll;
  max-height: 500px;
  max-width: 500px;
  #editPlBT,
  #hide {
    width: 220px;
  }
  #hide {
    background: rgb(255, 0, 119);
  }
}
.playListSongs {
  padding: 2px;
  .psong {
    background: rgba(255, 255, 255, 0.041);
    padding: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.39);
  }
  .removeBt {
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
    img {
      width: 22px;
      height: 22px;
      transition: 0.2s;
    }
  }
  .removeBt:hover {
    cursor: pointer;
    img {
      width: 27px;
      height: 27px;
      cursor: pointer;
    }
  }
}
.formBtn {
  margin: auto;
  margin-bottom: 5px;
  padding: 5px;
  width: 40px;
  background: #0058dd;
  border-radius: 5px;
  transition: 0.2s ease;
}
.formBtn:hover {
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.3em;
  text-transform: uppercase;
}
</style>
