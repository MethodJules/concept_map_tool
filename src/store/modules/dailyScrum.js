
const state = {
    rowData: [],
}

// brings datas from the state.
const getters = {
    getRowData(state) {
        // data bring
        return state;
    },

}


// updates states with the datas we send to it.
const mutations = {
    updateRowData(state) {
        // Update the data in state
        state.push("data")

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