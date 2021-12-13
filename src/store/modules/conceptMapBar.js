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
            data: data,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
        };
        axios(config)
            .then(async (response) => {
                dispatch("addConceptMapToUser", response.data.data)
                conceptMap.id = response.data.data.id;
                await rootState.conceptMap.concept_maps.push(conceptMap);
                let index = rootState.conceptMap.concept_maps.indexOf(conceptMap);
                rootState.conceptMap.index = index;

                (index) ? rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[index] : rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[0];
                // when the concept map created, if it is the first one we need to change isThereAnyConceptMap to true to show the main page.
                (rootState.drupal_api.user.concept_maps.length <= 0) ? rootState.drupal_api.isThereAnyConceptMap = true : "";
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
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        loginAxios(config)
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
        rootState.drupal_api.user.concept_maps.splice(payload.index, 1);
        rootState.conceptMap.activeConceptMap = rootState.conceptMap.concept_maps[0];
        // If there is no concept map, we need to change isThereAnyConceptMap to false to show the opening card to add first concept map
        (rootState.conceptMap.concept_maps.length <= 0) ? rootState.drupal_api.isThereAnyConceptMap = false : "";
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
    },

    /** Deletes concept map from database.
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} conceptMap concept map that we are going to delete from database.  
    */
    deleteConceptMapFromDatabase({ dispatch, rootState }, conceptMap) {
        let nodes = conceptMap.nodes;
        let links = conceptMap.links;
        nodes.forEach(node => {
            dispatch("deleteConcept", node)
        });
        links.forEach(link => {
            dispatch("deleteLinkFromRelationsTable", link.id);
        });

        var data = `{"data": {"type": "node--concept_map",
        "id": ${conceptMap.id}}}`;
        var config = {
            method: 'delete',
            url: `concept_map/${conceptMap.id}`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        axios(config)

    },

    /** Deletes the link from relations table.
      * @param {object} state it allows access to the state. We dont need it here. 
      * Because of es lint I cannot send an empty variable to the action. Thats why I need to send something with { }
      * @param {string} linkId The id of the link, to be deleted from relations table
    */
    deleteLinkFromRelationsTable({ rootState }, linkId) {
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}" 
            
        }]}`;
        var config = {
            method: 'delete',
            url: `relationship/${linkId}`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        axios(config)
    },

    /**
* Deletes concept from Database and trigger mutation in order to delete it from state.
* @param {object} commit we need it for mutation 
* @param {object} concept that we are going to delete from both database and state 
*/
    deleteConcept({ rootState }, concept) {
        // Deletes it from database
        var config = {
            method: 'delete',
            url: `concept/${concept.id}`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
        };
        axios(config)
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
    },
    /**
     * Deletes a tag from concept map. 
     * @param {object} rootState, it allows access to states of other modules. 
     * @param {array} tags, all tags on the concept map, without the one that we deleted.
     */
    deleteTagFromConceptMap({ rootState }, tags) {
        let conceptMapId = rootState.conceptMap.activeConceptMap.id;
        let tagsToSend = JSON.stringify(tags);

        var data = `{"data":{"type":"node--concept-map", "id": "${conceptMapId}", "attributes": {"field_conceptmap_tags": ${tagsToSend}}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${conceptMapId}`,
            data: data
        };
        axios(config)
    },
}





export default {
    namespaced: true,
    state,
    actions,
}
