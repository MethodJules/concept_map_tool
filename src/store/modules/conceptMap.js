import axios from 'axios';

const state = () => ({
    nodes: [
        { id: 1, name: "my node 1" },
        { id: 2, name: "my node 2" },
        { id: 3, _color: "orange" },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
    ],
    links: [
        { sid: 1, tid: 2, _color: "red" },
        { sid: 2, tid: 8, _color: "f0f" },
        { sid: 3, tid: 4, _color: "rebeccapurple" },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 },
    ],

})

const getters = {
    getLinks(state) {
        return state.links;

    },
    getNodes(state) {
        return state.nodes;
    },

}

const actions = {
    addConceptToConceptMap({ commit }, concept) {
        commit('ADD_CONCEPT_TO_CONCEPT_MAP', concept)
    },

    addRelationshipToConceptMap({ commit }, relationship) {
        commit('ADD_RELATIONSHIP_TO_CONCEPT_MAP', relationship);
    },

    async loadConceptMapFromBackend({ commit }) {
        await axios.get('https://clr-backend.x-navi.de/jsonapi/node/concept_map')
            .then((response) => {
                //console.log(response);
                //let concept_map = [];
                const data = response.data.data;
                commit('INITIALIZE_CONCEPT_MAP', data);
                //commit('INITIALIZE_CONCEPT_MAP', concept_map);
            }).catch(error => {
                throw new Error(`API ${error}`);
            });
    },


}

export default {
    namespaced: true,
    state,
    getters,
    actions
}