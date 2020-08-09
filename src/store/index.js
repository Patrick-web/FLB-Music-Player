import Vuex from "vuex";
import Vue from "vue";
import tracks from "./modules/tracks";
import lyrics from "./modules/lyrics";
import podcasts from "./modules/podcasts";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tracks,
    lyrics,
    podcasts,
  },
});
