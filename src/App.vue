<template>
    <div id="app">
        <div
            class="app-loading-bar"
            v-if="!(finishedLoading && finishedActiveConceptMapLoading)"
        >
            <b-spinner></b-spinner>
        </div>
        <div id="appContainer" class="app-container" v-if="finishedLoading">
            <div class="loading" v-if="buttonClicked">
                <div class="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </div>
            <Header />
            <div class="page-container" v-if="finishedLoading">
                <transition name="fade" mode="out-in">
                    <router-view v-if="finishedLoading"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
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
    },
    computed: {
        ...mapGetters({
            buttonClicked: "getButtonClicked",
            finishedActiveConceptMapLoading: "conceptMap/getFinishedLoading",
        }),
    },
    async mounted() {
        await this.$store.dispatch("drupal_api/loadTokensfromSessionStorage");
        this.finishedLoading = true;
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
    height: 100vh;
}

.hide {
    display: none;
}
</style>
