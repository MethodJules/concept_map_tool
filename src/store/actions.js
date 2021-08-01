import axios from '@/config/custom_axios'

/**
 * Triggers loading bar.
 * @param {*} commit 
 */
export const triggerLoading = ({ commit }) => {
    commit("triggerLoading")
}

    // setter for delete mode
export const toggleDeleteMode = ({state}) => {
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
                concepts.push({ name: data[i].attributes.title, nid: data[i].attributes.drupal_internal__nid, id: data[i].id });
            }
            commit("SAVE_CONCEPTS", concepts)
        }).catch(error => {
            throw new Error(`API ${error}`);
        });
}
/**
 * Commits to add concepts to the database. 
 * @param {commit}  
 * @param {conceptName} the concept name that we send in order to save to database 
 */
export const addConceptToDb = ({ commit }, conceptName) => {
    commit("ADD_NEW_CONCEPT", conceptName);
}

/**
 * Deletes concept from Database and trigger mutation in order to delete it from state.
 * @param {commit} commit we need it for mutation 
 * @param {concept} concept that we are going to delete from both database and state 
 */
export const deleteConcept = ({ commit }, concept) => {
    // Deletes it from database
    var config = {
        method: 'delete',
        url: `concept/${concept.id}`,
    };
    axios(config)
    // ACTIVATE THESE LINES in order to understand what is going on with axios and look at the console. 
    //     .then((response) => {
    //         console.log(response);
    //     }).catch(function (error) {
    //         console.log(error);
    //     });

    // Triggers mutation
    commit('DELETE_CONCEPT', concept);
}
/**
 * Commits to update the name of the concept.
 * @param {*} commit 
 * @param {object} payload includes concept as an object and new concept name as string 
 */
export const updateConcept = ({ commit }, payload) => {
    commit("UPDATE_CONCEPT", payload);

}
