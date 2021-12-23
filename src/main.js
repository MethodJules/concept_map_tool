import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './store/store'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'



// Third Party Packages
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-d3-network/dist/vue-d3-network.css'
import VueHtmlToPaper from 'vue-html-to-paper';



Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueHtmlToPaper);



Vue.use(Vuex);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')