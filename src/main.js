// import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './store/store'
import { createApp } from "vue";




// Third Party Packages
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-d3-network/dist/vue-d3-network.css'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueFullscreen from 'vue-fullscreen'
import VueHtmlToPaper from 'vue-html-to-paper';


// Vue.use(VueHtmlToPaper);
// Vue.config.productionTip = false
// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)
// Vue.use(Vuetify)
// Vue.use(Vuelidate)
// Vue.use(VueFullscreen)
// Vue.use(Vuex);

const app = createApp(App)

app.config.globalProperties.$http = () => { }
app.use(VueHtmlToPaper)
app.use(BootstrapVue)
app.use(IconsPlugin)
app.use(Vuetify)
app.use(Vuelidate)
app.use(VueFullscreen)
app.use(Vuex)
app.use(router)
app.use(store)

app.mount('#app')

// app.mount(App)

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).createApp(App).mount()