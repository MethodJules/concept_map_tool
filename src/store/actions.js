import axios from '@/config/custom_axios'
/**
* Triggers loading bar.
* @param {*} commit 
*/
export const triggerLoading = ({ commit }) => {
    commit("triggerLoading")
}

// setter for delete mode
export const toggleDeleteMode = ({ state }) => {
    state.deleteMode = !state.deleteMode;
}

/**
* Loads the concepts from database and send them to mutation with commit. 
* @param {commit}
*  
*/
export const loadConceptListFromDb = ({ rootState, dispatch }) => {
    let uid = rootState.drupal_api.user.uid
    let link = `concept?filter[field_uid]=${uid}`;
    dispatch("fetchConceptsFromDb", link);
}
/**
 * Loads concepts from database. 
 * @param {object} commit, it is being used to call a mutation
 * @param {object} dispatch, it is being used to call an action 
 * @param {object} state, state as parameter for access and manipulation of state data 
 * @param {string} link, link to make the get concepts from db
 */
export const fetchConceptsFromDb = ({ commit, dispatch, state }, link) => {
    axios.get(link)
        .then(async (response) => {
            const data = response.data.data;
            let concepts = [];
            for (var i in data) {
                concepts.push({
                    name: data[i].attributes.title,
                    nid: data[i].attributes.drupal_internal__nid,
                    id: data[i].id,
                    conceptMapId: data[i].attributes.field_concept_map_id
                });
            }
            commit("SAVE_CONCEPTS", concepts)
            // While olunca site patliyor. Neden?
            if (response.data.links.next) {
                let link = await dispatch("createLink", response.data.links.next.href);
                await dispatch("fetchConceptsFromDb", link);
            }
            // Will be removed
            if (concepts.length <= 0) {
                state.noConceptsLoaded = true;
            }
        }).catch(error => {
            throw new Error(`API ${error}`);
        });
}

/**
 * It changes the given link which comes from response.next to the proper form
 * to be able to send it to axios. 
 * @param {*} ctx 
 * @param {string} link, link to make to proper form 
 * @returns {string} newLink, link in proper form
 */
export const createLink = (ctx, link) => {
    let index = link.indexOf("node/");
    let newLink = link.slice(index + 5);
    return newLink;
}

/**
* Commits to add concepts to the database. 
* @param {commit}  
* @param {conceptName} the concept name that we send in order to save to database 
*/
export const addConceptToDb = ({ commit, rootState }, conceptName) => {
    var data = `{"data":{
        "type":"node--concept",
        "attributes": {
            "title": "${conceptName}", 
            "field_concept_map_id": "${rootState.conceptMap.conceptMap.id}",
            "field_uid": "${rootState.drupal_api.user.uid}" 
        }
    }}`;

    var config = {
        method: 'post',
        url: 'concept',
        headers: {
            'Authorization': rootState.drupal_api.authToken,
            'X-CSRF-Token': rootState.drupal_api.csrf_token
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            commit("ADD_NEW_CONCEPT", {
                name: conceptName,
                id: response.data.data.id,
                nid: response.data.data.attributes.drupal_internal__nid,
                conceptMapId: rootState.conceptMap.conceptMap.id,
                uid: rootState.drupal_api.user.uid
            });
        })
}

/**
* Deletes concept from Database and trigger mutation in order to delete it from state.
* @param {commit} commit we need it for mutation 
* @param {object} concept that we are going to delete from both database and state 
*/
export const deleteConcept = ({ commit, rootState }, concept) => {
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
    // send it to mutation to save it in state
    commit('DELETE_CONCEPT', concept);
}
/**
* Commits to update the name of the concept.
* @param {*} commit 
* @param {object} payload includes concept as an object and new concept name as string 
*/
export const updateConcept = ({ commit, rootState }, payload) => {
    commit("UPDATE_CONCEPT", payload);
    commit("UPDATE_CONCEPT_IN_MAP", payload);
    var data = `{"data":{"type":"node--concept", 
    "id": "${payload.concept.id}", 
    "attributes": {
        "title": "${payload.neuConceptName}", 
        "field_concept_map_id": "${payload.concept.conceptMapId}", 
        "field_uid": "${rootState.drupal_api.user.uid}" }}}`;
    var config = {
        method: 'patch',
        url: `concept/${payload.concept.id}`,
        headers: {
            'Authorization': rootState.drupal_api.authToken,
            'X-CSRF-Token': rootState.drupal_api.csrf_token
        },
        data: data
    };
    axios(config)

}
