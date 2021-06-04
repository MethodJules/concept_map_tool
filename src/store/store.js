import Vue from "vue"
import Vuex from "vuex"
import comments from "./modules/comments"
import dailyScrum from "./modules/dailyScrum"
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

    },
    getters,
    mutations,
    actions,
    modules: {
        comments,
        dailyScrum
    }

});