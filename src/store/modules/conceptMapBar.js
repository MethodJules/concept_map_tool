import axios from "@/config/custom_axios";
import loginAxios from "@/config/login_axios"

const state = () => ({

})

const actions = {

    /** Sends concept map to database.
    * It also triggers the action to save it in the user.
    * @param {*} commit, commit is being used to call a mutation
    * @param {*} dispatch, dispatch is being used to call an aciton
    * @param {object} conceptMap,the concept map, to save in database and state
    */
    async createConceptMap({ rootState, commit, dispatch }, conceptMap) {
        var data = `{"data": {"type": "node--concept_map",
        "attributes": {"title": "${conceptMap.title}"}}}`;
        var config = {
            method: 'post',
            url: 'concept_map',
            data: data
        };
        axios(config)
            .then(async (response) => {
                dispatch("addConceptMapToUser", response.data.data)
                conceptMap.id = response.data.data.id;
                await commit("CREATE_CONCEPT_MAP", conceptMap);
                let index = rootState.conceptMap.concept_maps.indexOf(conceptMap);
                await commit("UPDATE_INDEX", index);
                await commit("UPDATE_AKTIVE_CONCEPT_MAP", index)
            })
            .catch((error) => {
                console.log(error)
            })
    },
    /** Deletes Concept map from database.
    * Commits a mutation to delete it from state
    * Commits a mutation to update active concept map
    * @param {commit} commit to call a mutation
    * @param {rootState} rootState to reach the state of other modules. 
    * @param {object} payload it stores the id of the concept map that we are going to delete 
    */
    deleteConceptMapFromUser({ commit, rootState }, payload) {
        commit("DELETE_CONCEPT_MAP_FROM_STATE", payload);
        commit("UPDATE_AKTIVE_CONCEPT_MAP");
        var data = `{
            "data" : [{
                "type": "node--concept_map",
                "id": "${payload.conceptMap.id}"
            }]
        }`;
        var config = {
            method: 'delete',
            url: `jsonapi/user/user/${rootState.drupal_api.user.id}/relationships/field_concept_maps`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`
            },
            data: data
        };

        loginAxios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })


    },

    /** Deletes concept map from database.
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} conceptMap concept map that we are going to delete from database.  
    */
    deleteConceptMapFromDatabase({ state }, conceptMap) {
        console.log(state);
        var data = `{"data": {"type": "node--concept_map",
        "id": ${conceptMap.id}}}`;
        var config = {
            method: 'delete',
            url: `concept_map/${conceptMap.id}`,
            data: data
        };
        axios(config).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    },

    /** Changes the name of concept map in database. 
    * @param {commit} commit to call mutation 
    * @param {object} payload stores the concept map to change name and the index of it. 
    */
    changeConceptMapName({ commit }, payload) {
        commit("CHANGE_CONCEPT_MAP_NAME", payload)
        var data = `{"data":{"type":"node--concept-map", "id": "${payload.conceptMap.id}", "attributes": {"title": "${payload.newName}"}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${payload.conceptMap.id}`,
            data: data
        };
        axios(config)
    },
    /** Loads concept map from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {*} commit, it is being used to call a mutation
    *  @param {*} rootState, it allows access to states of other modules in store.
    *  @param {*} dispatch, it is being used to call an action
    */


    addTagToConceptMap({ rootState }, tags) {
        let conceptMapId = rootState.conceptMap.activeConceptMap.id;

        var data = `{"data":{"type":"node--concept-map", "id": "${conceptMapId}", "attributes": {"field_conceptmap_tags": ${JSON.stringify(tags)}}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${conceptMapId}`,
            data: data
        };
        axios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })
    },

    deleteTagFromConceptMap({ rootState }, tags) {
        let conceptMapId = rootState.conceptMap.activeConceptMap.id;
        let tagsToSend = JSON.stringify(tags);
        console.log(tagsToSend)
        var data = `{"data":{"type":"node--concept-map", "id": "${conceptMapId}", "attributes": {"field_conceptmap_tags": ${tagsToSend}}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${conceptMapId}`,
            data: data
        };
        axios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })

    }
}

const mutations = {
    /**
    * Saves the given concept map to the state.
    * @param {*} state 
    * @param {*} conceptMap 
    */
    CREATE_CONCEPT_MAP(rootState, conceptMap) {
        return rootState.conceptMap.concept_maps.push(conceptMap);
    },

    /**
    * Deletes concept map from state.
    * @param {object} state as parameter to access and manipulation of state data  
    * @param {object} payload stores the concept map to delete
    */
    DELETE_CONCEPT_MAP_FROM_STATE(rootState, payload) {
        rootState.conceptMap.concept_maps.splice(payload.index, 1);
    },
    /**
    * Changes the name of the concept map in state
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} payload stores the new name and index of the concept map and concept map itself  
    */
    CHANGE_CONCEPT_MAP_NAME(rootState, payload) {
        rootState.conceptMap.concept_maps[payload.index].title = payload.newName;
    },
    /**
    * Updates the index value
    * @param {object} state, state as variable to access and manipulation of state data 
    * @param {int} index, the new index to save
    * @returns index, the index value in the state
    */
    UPDATE_INDEX(rootState, index) {
        rootState.conceptMap.index = index;
        return rootState.conceptMap.index;
    },

    /**
    * Updates the active concept map in state.
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {int} index the index value of the active concept map in concept_maps array  
    */
    UPDATE_AKTIVE_CONCEPT_MAP(rootState, index) {
        (index) ? rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[index] : rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[0];
    }

}



export default {
    namespaced: true,
    state,
    actions,
    mutations
}
