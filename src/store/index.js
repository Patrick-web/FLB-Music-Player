import Vuex from "vuex";
import Vue from "vue";
import tracks from "./modules/tracks";
import lyrics from "./modules/lyrics";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tracks,
    lyrics,
  },
});
