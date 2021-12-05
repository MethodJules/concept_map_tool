/**
 * Triggers loading bar. 
 * @param {*} state 
 */
export const triggerLoading = (state) => {
    // Changing the value of buttonClicked in state.
    // It triggers loading div.
    state.buttonClicked = true;
    setTimeout(() => {
        state.buttonClicked = false;
    }, 2000);
}

/**
 * Saves concept to state. 
 * @param {*} state 
 * @param {object} concepts concept to save. 
 */
export const SAVE_CONCEPTS = (state, concepts) => {
    state.concepts = concepts;
}


/**
 * Updates the name of the concept.
 * @param {object} state, to reach and manipulate the state  
 * @param {object} payload includes concept as an object and new concept name as string 
 */
export const UPDATE_CONCEPT = (state, payload) => {
    console.log(state)
    let index = state.concepts.indexOf(payload.concept);
    state.concepts[index].name = payload.neuConceptName;
}
/**
 * Changes the name of the concept in concept map.
 * It looks for the index of the concept in concept map first. 
 * After finding it, changes the name.  
 * @param {object} state, to reach and manipulate the state
 * @param {object} payload, consist new concept name and concept   
 */
export const UPDATE_CONCEPT_IN_MAP = (state, payload) => {
    let conceptMaps = state.conceptMap.concept_maps;
    conceptMaps.forEach(map => {
        if (map.id == payload.concept.conceptMapId) {
            let nodes = map.nodes;
            let index;
            nodes.forEach(node => {
                (node.id == payload.concept.id) ? index = node.index : "";
            })
            nodes[index].name = payload.concept.name;
        }
    });
}
/**
 * Saves concept name to database.
 * It takes the name of concept only. 
 * Then generate the proper format to save database.
 * 
 * @param {state} state  
 * @param {conceptName} conceptName to save database 
 */
export const ADD_NEW_CONCEPT = (state, concept) => {
    state.concepts.push(concept);
}

/**
 * Deletes concept from state. 
 * @param {state} state 
 * @param {concept} concept that we are going to delete. 
 */
export const DELETE_CONCEPT = (state, concept) => {
    let index = state.concepts.indexOf(concept);
    state.concepts.splice(index, 1);
}


