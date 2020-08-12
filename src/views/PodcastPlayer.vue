<template>
  <div class="view podcasts">
    <TabSwitcher />
    <div class="contentView">
      <PodcastPage />
      <div class="pagesWrapper">
        <div class="subscribedPage podPage">
          <div class="tabTitle">Subscribed</div>
          <div class="genresCont">
            <br />
            <div class="genrePods">
              <Scard
                v-for="podcast in subscribed"
                :key="podcast.podId"
                :podID="podcast.podId"
                :podName="podcast.name"
                :podDescription="podcast.description"
                :podThumbnail="podcast.thumbnail"
                :isSubscribed="true"
              />
            </div>
          </div>
        </div>
        <div class="explorePage podPage">
          <Titlebar />
          <Genres />
          <div class="genresCont exploreGenresCont">
            <div
              v-for="(genre, gindex) in dataToRender"
              :key="genre.id"
              class="genreWrapper"
            >
              <p class="genreName">{{ genre.genre }}</p>
              <div class="genrePods">
                <Scard
                  v-for="(podcast, pindex) in genre.podcasts"
                  :key="podcast.id"
                  :podID="podcast.id"
                  :podName="podcast.title"
                  :podDescription="podcast.description"
                  :podThumbnail="podcast.image"
                  :isSubscribed="podcast.isSubscribed"
                  :genreIndex="gindex"
                  :podcastIndex="pindex"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="downloadedPage podPage">
          <div class="tabTitle">Downloaded</div>
        </div>
      </div>
      <!-- contentView -->
    </div>
    <div class="sidePane">
      <!-- <pane /> -->
      <PlayingPane />
    </div>
  </div>
</template>
<script>
import TabSwitcher from "@/components/forPodcasts/tabSwitcher";
import Titlebar from "@/components/forPodcasts/titlebar.vue";
import Scard from "@/components/forPodcasts/SquareCard.vue";
import PlayingPane from "@/components/forPodcasts/PlayingPane.vue";
import pane from "@/components/forPodcasts/pane.vue";
import Genres from "@/components/forPodcasts/Genres.vue";
import PodcastPage from "@/components/forPodcasts/PodcastPage.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  mounted() {
    this.loadedSubscribedFromStorage();
    const podsCont = document.querySelector(".exploreGenresCont");
    podsCont.addEventListener("scroll", (e) => {
      const scrollAmount = e.srcElement.scrollTop;
      if (
        scrollAmount > 800 &&
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
    ...mapActions(["fetchByGenre", "loadedSubscribedFromStorage"]),
  },
  computed: mapGetters(["dataToRender", "subscribed"]),
  data() {
    return {
      render: true,
    };
  },
  components: {
    PlayingPane,
    TabSwitcher,
    Titlebar,
    Scard,
    Genres,
    PodcastPage,
    pane,
  },
};
</script>

<style lang="scss">
.podcasts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  overflow: hidden;
}
.pagesWrapper {
  height: auto;
  width: 100%;
  position: absolute;
  top: -100%;
  transition: 0.3s ease-in-out;
  .podPage {
    height: 100vh;
  }
  .downloadedPage {
  }
  .explorePage {
    // background: black;
  }
  .subscribedPage {
    padding-top: 5px;
  }
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
  position: relative;
  overflow: hidden;
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
