import Vuex from 'vuex';
import Vue from 'vue';
import tracks from './modules/tracks';
Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        tracks
    }
})