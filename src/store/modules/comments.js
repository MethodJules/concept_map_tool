
const state = {
    comments: [],
}

// brings datas from the state.
const getters = {
    getComments(state) {
        // comment bring
        return state;
    },

}


// updates states with the datas we send to it.
const mutations = {
    updateComment(state) {
        // Update the comment in state
        state.push("data");

    }
}


//
const actions = {
    // what we need at the begining?

}

export default {
    state,
    getters,
    mutations,
    actions
}