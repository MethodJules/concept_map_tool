import Vue from "vue"
import Vuex from "vuex"
import conceptMap from "./modules/conceptMap"
import conceptMapBar from "./modules/conceptMapBar"
import drupal_api from "./modules/drupal_api"
import sparky_api from "./modules/sparky_api"
import * as getters from "./getters"
import * as mutations from "./mutations"
import * as actions from "./actions"

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        concept_map: {
        },
        concepts: [],
        buttonClicked: false,
        deleteMode: false,
    },
    getters,
    mutations,
    actions,
    modules: {
        conceptMap,
        conceptMapBar,
        drupal_api,
        sparky_api

    }

});

export default store;