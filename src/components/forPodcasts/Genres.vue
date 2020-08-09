<template>
  <div class="podGenres">
    <div class="gWrapper">
      <p
        v-on:click="markActive($event)"
        @click="fetchBestPods"
        class="activeGenre"
        style="min-width:80px"
      >
        Top
      </p>
      <p
        v-on:click="markActive($event)"
        @click="fetchCuratedPods"
        class="genre"
      >
        Curated
      </p>
      <p
        v-on:click="markActive($event)"
        @click="fetchGenre"
        class="genre sGenre"
        v-for="genre in AllGenres"
        :key="genre.id"
      >
        {{ genre.name }}
        <span style="display:none" id="genreID">{{ genre.id }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: mapGetters(["AllGenres"]),
  methods: {
    ...mapActions(["fetchBestPods", "fetchCuratedPods", "fetchByGenre"]),
    markActive(e) {
      const podsCont = document.querySelector(".genresCont");
      podsCont.scrollTop = 0;
      if (!e.target.classList.contains("sGenre")) {
        document.body.classList.remove("specificGenreFetch");
      } else {
        document.body.classList.add("specificGenreFetch");
      }
      document.querySelector(".activeGenre").className = "genre";
      // document.querySelector(".activeGenre").classList.remove("activeGenre");
      e.target.className = "activeGenre";
    },
    fetchGenre(e) {
      window.fetchedNewPage2 = false;
      window.fetchedNewPage3 = false;
      const genreID = e.target.querySelector("#genreID").textContent;
      window.currentGenreID = genreID;
      // console.log(window.currentGenreID);
      this.fetchByGenre(1);
    },
  },
  mounted() {
    console.log("csdcdsc");
    this.fetchBestPods();
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.podGenres {
  overflow: hidden;
  height: 20px;
  min-width: 600px;
  margin-bottom: 10px;
  transition: 0.2s ease;
  background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
  padding-top: 2px;
  padding-bottom: 9px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.gWrapper {
  overflow: auto;
  display: flex;
  p {
    min-width: 100px;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    padding-right: 5px;
    padding-left: 5px;
  }
  .genre:hover {
    cursor: pointer;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.25);
  }
  .activeGenre {
    background: rgb(var(--base-one), var(--base-two), var(--base-three));
    font-weight: 600;
  }
  .activeGenre:hover {
    cursor: default;
  }
}
</style>
