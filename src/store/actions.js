import axios from 'axios'


// Concept List Actions 
export const loadConceptListFromDb = ({ state, commit }) => {
    const concept_map_nodes = state.concept_map.nodes;
    console.log(concept_map_nodes);
    axios.get('https://clr-backend.x-navi.de/jsonapi/node/concept')
        .then((response) => {
            console.log(response);
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

export const addConceptToDb = ({ commit }, concept) => {
    commit("ADD_NEW_CONCEPT", concept);
}


// addConcept({commit}, concept) {
//     commit('ADD_NEW_CONCEPT', concept);

// }
// deleteConcept({commit}, concept) {
//     console.log(`das hier ist die ID von Concept  https://clr-backend.x-navi.de/jsonapi/node/concept/${concept.id}`)
//     var config = {
//         method: 'delete',
//         url: `https://clr-backend.x-navi.de/jsonapi/node/concept/${concept.id}`,
//         headers: {
//             'Accept': 'application/vnd.api+json',
//             'Content-Type': 'application/vnd.api+json',
//             'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
//         },
//     };
//     axios(config)
//         .then((response) => {
//             console.log(response);
//         }).catch(function(error) {
//             console.log(error);
//         });
//     commit('DELETE_CONCEPT', concept);
// }

// Concept Map Actions


export const getConceptsFromDB = () => {


    axios.get('https://clr-backend.x-navi.de/jsonapi/node/concept_map')
        .then((response) => {

            const data = response.data.data;
            console.log(data);
            // commit('INITIALIZE_CONCEPT_MAP', data);
        }).catch(error => {
            throw new Error(`API ${error}`);
        });

}