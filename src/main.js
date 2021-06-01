import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store'

Vue.config.productionTip = false

Vue.use(Vuex)
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
