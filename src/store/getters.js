
/**
 * Returns concepts from stateç
 * @param {*} state 
 * @returns {object} concepts 
 */
export const getConcepts = (state) => {
    return state.concepts;
}

/**
 *  Return only the names of the concepts. 
 *  Somethimes we need only the names 
 * @param {state} state
 * @returns {string} names
 */
export const getConceptNames = (state) => {
    let concepts = state.concepts;
    let names = [];
    concepts.forEach(concept => {
        names.push(concept.name);
    });
    return names
}
/**
 * Getter for buttonClicked.
 * We are changing the value of buttonClicked when we want to trigger loading bar.
 * We need getter to check the value of this variable. 
 * For more info have a look App.vue which this getter used in.
 * @param {*} state 
 * @returns {boolean} buttonClicked
 */
export const getButtonClicked = (state) => {
    return state.buttonClicked;
}

export const getDeleteMode = (state) => {
    return state.deleteMode;
}
/**
 * Getter for the concepts of active concept map
 * @param {object} state, to reach and manipulate state 
 * @returns concepts, conceps of active concept map
 */
export const getFilteredConcepts = (state) => {
    let concepts = [];
    state.concepts.forEach(concept => {
        if (concept.conceptMapId == state.conceptMap.activeConceptMap.id) {
            concepts.push(concept);
        }
    });
    return concepts;
}