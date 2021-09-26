<template>
    <div id="app">
        <div class="loading" v-if="buttonClicked">
            <div class="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
        <Header />
        <div class="page-container">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
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
    mounted() {
        // await this.$store.dispatch("loadConceptListFromDb");
        // await this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
        this.$store.dispatch("drupal_api/loadTokensfromSessionStorage");
    },
};
</script>

<style>
@import "assets/loading.css";
html {
    height: 100vh;
}
body {
    height: 100%;
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    background-color: white;
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

.page-container {
    background-color: white;
}
</style>
