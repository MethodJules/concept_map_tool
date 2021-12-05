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
export const loadConceptListFromDb = ({ commit }) => {
    axios.get('concept')
        .then((response) => {
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
            return commit("SAVE_CONCEPTS", concepts)
        }).catch(error => {
            throw new Error(`API ${error}`);
        });


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
            "field_concept_map_id": "${rootState.conceptMap.activeConceptMap.id}" 
        }
    }}`;

    var config = {
        method: 'post',
        url: 'concept',
        data: data
    };

    axios(config)
        .then(function (response) {
            commit("ADD_NEW_CONCEPT", {
                name: conceptName,
                id: response.data.data.id,
                nid: response.data.data.attributes.drupal_internal__nid,
                conceptMapId: rootState.conceptMap.activeConceptMap.id
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

/**
* Deletes concept from Database and trigger mutation in order to delete it from state.
* @param {commit} commit we need it for mutation 
* @param {object} concept that we are going to delete from both database and state 
*/
export const deleteConcept = ({ commit }, concept) => {
    // Deletes it from database
    var config = {
        method: 'delete',
        url: `concept/${concept.id}`,
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
export const updateConcept = ({ commit }, payload) => {
    console.log(payload)
    commit("UPDATE_CONCEPT", payload);
    commit("UPDATE_CONCEPT_IN_MAP", payload);
    var data = `{"data":{"type":"node--concept", "id": "${payload.concept.id}", "attributes": {"title": "${payload.neuConceptName}"}}}`;

    var config = {
        method: 'patch',
        url: `concept/${payload.concept.id}`,
        data: data
    };
    axios(config)

}
