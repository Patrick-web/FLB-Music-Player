<template>
  <div class="view podcasts">
    <TabSwitcher />
    <div class="contentView">
      <Titlebar />
      <Genres />
      <div class="genresCont">
        <div v-for="genre in dataToRender" :key="genre.id" class="genreWrapper">
          <p class="genreName">{{ genre.genre }}</p>
          <div class="genrePods">
            <Scard
              v-for="podcast in genre.podcasts"
              :key="podcast.id"
              :podName="podcast.title"
              :podDescription="podcast.description"
              :podThumbnail="podcast.image"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="sidePane">
      <PlayingPane />
    </div>
  </div>
</template>
<script>
import TabSwitcher from "@/components/forPodcasts/tabSwitcher";
import Titlebar from "@/components/forPodcasts/titlebar.vue";
import Scard from "@/components/forPodcasts/SquareCard.vue";
import PlayingPane from "@/components/forPodcasts/PlayingPane.vue";
import Genres from "@/components/forPodcasts/Genres.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  mounted() {
    const podsCont = document.querySelector(".genresCont");
    podsCont.addEventListener("scroll", (e) => {
      const scrollAmount = e.srcElement.scrollTop;
      // console.log(scrollAmount);
      if (
        scrollAmount > 1000 &&
        document.body.classList.contains("specificGenreFetch") &&
        !window.fetchedNewPage2
      ) {
        window.fetchedNewPage2 = true;
        console.log("Fetching page 2");
        console.log(this);
        this.fetchByGenre(2);
      }
      if (
        scrollAmount > 2000 &&
        document.body.classList.contains("specificGenreFetch") &&
        !window.fetchedNewPage3
      ) {
        window.fetchedNewPage3 = true;
        this.fetchByGenre(3);
        console.log("Fetching page 3");
      }
    });
  },
  methods: {
    ...mapActions(["fetchByGenre"]),
  },
  computed: mapGetters(["dataToRender"]),
  data() {
    return {
      sampleData: [
        {
          genre: "Sample Genre",
          podcasts: [
            {
              podName: "Syntax.fm",
              desc: "Too lazy to write anything relevant",
            },
            {
              podName: "CodeNewBie",
              desc: "Too lazy to write anything relevant",
            },
            {
              podName: "StackOverFlow",
              desc: "Too lazy to write anything relevant",
            },
          ],
        },
      ],
    };
  },
  components: {
    TabSwitcher,
    Titlebar,
    Scard,
    PlayingPane,
    Genres,
  },
};
</script>

<style>
.podcasts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  overflow: hidden;
}
.genresCont {
  margin-top: 20px;
  height: 84vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.genreWrapper {
  margin-bottom: 40px;
}
.contentView {
  height: 100vh;
  width: 67.8vw;
}
.genrePods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 20px;
}
.genreName {
  margin-bottom: 10px;
  font-size: 1.4rem;
}
.sidePane {
  background: rgba(230, 230, 250, 0.089);
  width: 300px;
  height: 100vh;
}
</style>
