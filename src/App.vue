<template>
  <div id="app">
    <div class="loading" v-if="buttonClicked">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <Header />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  name: "App",
  components: {
    Header,
  },
  computed: {
    ...mapGetters({ buttonClicked: "getButtonClicked" }),
  },
  created() {
    this.$store.dispatch("loadConceptListFromDb");
    this.$store.dispatch("dailyScrum/loadDailysFromBackend");
  },
};
</script>

<style>
@import "assets/loading.css";
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  /* background-color: #fefffe; */
}
.fade-enter {
  opacity: 0.05;
}
.fade-enter-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
  opacity: 0.05;
}
</style>
