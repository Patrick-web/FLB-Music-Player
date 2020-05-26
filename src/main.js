import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueKinesis from 'vue-kinesis'
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
Vue.use(VueKinesis)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
