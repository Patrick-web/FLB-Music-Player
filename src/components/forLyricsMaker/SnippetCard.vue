<template>
  <div class="snippetCard">
    {{ snippet.text }}
    <h2 class="snippet_id">{{ snippet.id }}</h2>
    <div class="snippetOptions">
      <div class="rm sn_bt">
        <div class="icon"><img src="@/assets/x.svg" alt="" /></div>
        <p>Remove</p>
      </div>
      <div @click="createSnippet(snippet)" class="ad sn_bt">
        <div class="icon"><img src="@/assets/tick.svg" alt="" /></div>
        <p>Add</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      DEFAULT_WIDTH: 50,
    };
  },
  methods: {
    ...mapActions(["addSnippet"]),
    createSnippet(snippet) {
      const newSnippet = {
        id: Date.now(),
        text: snippet.text,
        width: this.DEFAULT_WIDTH,
      };
      this.addSnippet(newSnippet);
    },
  },
  props: ["snippet"],
};
</script>

<style lang="scss">
.snippetCard {
  width: 80%;
  height: 100px;
  background: var(--snippet_bg);
  font-weight: 300;
  line-height: 25px;
  padding: 8px;
  margin: 15px;
  text-align: left;
  border-radius: 10px;
  position: relative;
}
.snippetCard:hover {
  .snippetOptions {
    transform: scaleX(1);
  }
}
.snippetOptions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.432);
  transform: scaleX(0);
  transition: 0.2s ease;
}
.sn_bt {
  margin: 10px;
  margin-top: 20px;
  display: flex;
  width: 20%;
  align-items: center;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.479);
  border-radius: 5px;
  font-weight: 900;
  transition: 0.2s ease;
  .icon {
    box-shadow: 3px 0px 8px rgba(0, 0, 0, 0.479);
    height: 30px;
    width: 30px;
    background: white;
    margin-right: 10px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 60%;
    }
  }
  p {
    transform-origin: left center;
    transform: scaleX(0);
    transition: 0.22s ease;
    width: 0;
  }
}
.sn_bt:hover {
  cursor: pointer;
  width: 45%;
  p {
    transform: scaleX(1);
    width: 40px;
  }
}
.rm {
  background: var(--red);
}
.ad {
  background: var(--green);
  max-width: 80px;
}
.snippet_id {
  position: absolute;
  top: 50%;
  right: 0%;
  height: 20px;
  width: 20px;
  transform: translate(50%, -50%);
  background: white;
  border-radius: 50%;
  padding: 5px;
  color: var(--snippet_bg);
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.363);
}
</style>
