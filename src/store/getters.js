export const getConcepts = (state) => {
    //  Return concepts from state
    return state.concepts;
}

/**
 * 
 * @param {state} state
 *  Return only the names of the concepts. 
 *  Somethimes we need only the names 
 */
export const getConceptNames = (state) => {
 let concepts =  state.concepts;
 let names = [];
 concepts.forEach(concept => {
     names.push(concept.name);
 }); 
 return names
}

export const getButtonClicked = (state) => {
    return state.buttonClicked;
}