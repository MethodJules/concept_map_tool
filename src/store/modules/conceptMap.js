import axios from "axios"
const state = () => ({

    nodes: [],
    links: [],
    // nodes: [
    //     { id: 1, name: "my node 1" },
    //     { id: 2, name: "my node 2" },
    //     { id: 3, _color: "orange" },
    //     { id: 4 },
    //     { id: 5 },
    //     { id: 6 },
    //     { id: 7 },
    //     { id: 8 },
    //     { id: 9 },
    // ],
    // links: [
    //     { sid: 1, tid: 2, _color: "red" },
    //     { sid: 2, tid: 8, _color: "f0f" },
    //     { sid: 3, tid: 4, _color: "rebeccapurple" },
    //     { sid: 4, tid: 5 },
    //     { sid: 5, tid: 6 },
    //     { sid: 7, tid: 8 },
    //     { sid: 5, tid: 8 },
    //     { sid: 3, tid: 8 },
    //     { sid: 7, tid: 9 },
    // ],

})

const getters = {
    getLinks(state) {
        return state.links;

    },
    getNodes(state) {
        return state.nodes;
    },

}

const actions = {

    addConceptToConceptMap({commit}, concept) {
        commit('ADD_CONCEPT_TO_CONCEPT_MAP', concept)
    },

    addRelationshipToConceptMap({commit}, relationship) {
        commit('ADD_RELATIONSHIP_TO_CONCEPT_MAP', relationship);
    },

    async loadConceptMapFromBackend({commit}) {
        await axios.get('https://clr-backend.x-navi.de/jsonapi/node/concept_map')
            .then((response) => {
              
                const data = response.data.data;
                commit('INITIALIZE_CONCEPT_MAP', data);
            }).catch(error => {
                throw new Error(`API ${error}`);
            });
    },



}

const mutations = {

    ADD_CONCEPT_TO_CONCEPT_MAP(state, concept) {
        console.log("Concept Map::::::::")
        console.log(state.nodes);
        let nodesInMap = state.nodes;
        let isMapConsist = false;
        console.log("TArget: ")
        console.log(concept)
        nodesInMap.forEach(node => {
            if(node.id == concept.id) isMapConsist = true;
            
        });
        console.log(isMapConsist);
        console.log(concept);
        
        if(!isMapConsist){

            state.nodes.push({
                id: concept.id,
                name: concept.name,
                uuid: concept.id,
                
            })
        }
    
    },
    
    ADD_RELATIONSHIP_TO_CONCEPT_MAP(state, relationship) {
        console.log("Relationships:")
        console.log(relationship);
        state.links.push({
            id: Math.random() * 1000, 
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: "test" + relationship[0].sid,
        })
        

    },

    // this makes his job. Brings concepts and relations from backend. 
    INITIALIZE_CONCEPT_MAP(state, concept_map) {
        //TODO: Hier kode rein
        //state.nodes = concept_map.nodes; //TODO: Verlinkung
        //state.links = concept_map.relationships;//TODO: Verlinkung
        concept_map.forEach(element => {
            // lement is ok.
            const concepts = element.relationships.field_conceptmap_concepts.data;
            const relationships = element.relationships.field_conceptmap_relationships.data;
            
         //concept and relations OK.
      
           
            concepts.forEach(element => {
                // element is coming OK.
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/concept/${element.id}`)
                    .then((response) => {
                       
                        // Response is ok. 
                        const title = response.data.data.attributes.title;
                        //const id = response.data.data.attributes.drupal_internal__nid;
                        const uuid = response.data.data.id;
                        state.nodes.push({id: uuid, name: title, uuid: uuid});
                    })
         
            });

      
            //Get relationships of concept map
       
            relationships.forEach(relationship => {
           
              // REl is is ok.
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/relationship/${relationship.id}`)
                    .then((response) => {

                        console.log(response);
                        const label = response.data.data.attributes.title;
                        const sid = response.data.data.attributes.field_sid;
                        const tid = response.data.data.attributes.field_tid;
                        // above 3 is ok too.....
                        state.links.push({sid: sid, tid: tid, _color: '#c93e37', name: label})
                    })
            })
            


        });
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}