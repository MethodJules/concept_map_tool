<template>
  <div id="app">
    <div
      id="appContainer"
      class="app-container"
      v-if="finishedLoading && !xNavi"
    >
      <div class="loading" v-if="buttonClicked">
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      <Header />
      <div class="page-container" v-if="finishedLoading && !xNavi">
        <transition name="fade" mode="out-in">
          <router-view v-if="finishedLoading"></router-view>
        </transition>
      </div>
    </div>
    <Footer v-if="!xNavi" />
    <router-view v-if="finishedLoading && xNavi"></router-view>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import Footer from "@/components/shared/Footer.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      finishedLoading: false,
    };
  },
  name: "App",
  components: {
    Header,
    Footer,
  },
  computed: {
    ...mapGetters({
      buttonClicked: "getButtonClicked",
    }),
    xNavi() {
      let result = false;
      this.$route.name === "concept-map" ? (result = true) : "";
      return result;
    },
  },

  async mounted() {
    await this.$store.dispatch("drupal_api/loadTokensfromSessionStorage");
    this.finishedLoading = true;
  },
};
</script>

<style>
@import "assets/loading.css";
body {
  overflow: visible !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-container {
  flex: 1;
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
.app-loading-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.hide {
  display: none;
}
</style>
