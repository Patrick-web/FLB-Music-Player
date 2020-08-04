import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import VueParticles from "vue-particles";

Vue.use(VueParticles);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
