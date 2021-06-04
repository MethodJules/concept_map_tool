<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
  created() {
    this.$store.dispatch("loadConceptListFromDb");
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.3s ease-out;
}

.fade-leave-active {
  transition: opacity 0.3s ease-out;
  opacity: 0;
}
</style>
