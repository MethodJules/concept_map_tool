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
    async createConceptMap({ rootState, dispatch }, conceptMap) {
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
                await rootState.conceptMap.concept_maps.push(conceptMap);
                let index = rootState.conceptMap.concept_maps.indexOf(conceptMap);
                rootState.conceptMap.index = index;

                (index) ? rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[index] : rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[0];
            })
            .catch((error) => {
                console.log(error)
            })
    },

    /** Adds concept map id to the user in database.
    * @param {rootState} rootState, it allows access to states of other modules in store
    * @param {object} conceptMap, the concept map to save to user in database. 
    */
    addConceptMapToUser({ rootState }, conceptMap) {
        let userId = rootState.drupal_api.user.id;
        var data = `{
            "data": [{
                "type": "node--concept_map",
                "id": "${conceptMap.id}"
            }]
        }`;
        var config = {
            method: 'post',
            url: `jsonapi/user/user/${userId}/relationships/field_concept_maps`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`
            },
            data: data
        };
        loginAxios(config)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
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
    deleteConceptMapFromUser({ rootState }, payload) {
        rootState.conceptMap.concept_maps.splice(payload.index, 1);
        rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[0];
        console.log(rootState.conceptMap)
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
    changeConceptMapName({ rootState }, payload) {
        rootState.conceptMap.concept_maps[payload.index].title = payload.newName;
        var data = `{"data":{"type":"node--concept-map", "id": "${payload.conceptMap.id}", "attributes": {"title": "${payload.newName}"}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${payload.conceptMap.id}`,
            data: data
        };
        axios(config)
    },
    /** 
     * Loads concept map from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {*} commit, it is being used to call a mutation
    *  @param {*} rootState, it allows access to states of other modules in store.
    *  @param {*} dispatch, it is being used to call an action
    */

    /**
     * Adds tag to concept map. 
     * @param {object} rootState, it allows access to states of other modules in store 
     * @param {array} tags, all tags on the concept map
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
    /**
     * Deletes a tag from concept map. 
     * @param {object} rootState, it allows access to states of other modules. 
     * @param {array} tags, all tags on the concept map, without the one that we deleted.
     */
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





export default {
    namespaced: true,
    state,
    actions,
}
