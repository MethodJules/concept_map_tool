import Vue from "vue"
import Vuex from "vuex"
import conceptMap from "./modules/conceptMap"
import * as getters from "./getters"
import * as mutations from "./mutations"
import * as actions from "./actions"

Vue.use(Vuex);

export default new Vuex.Store({

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

    }

});