import axios from "axios"
const state = () => ({

    nodes: [],
    links: [],
    

})

const getters = {
    getLinks(state) {
        return state.links;

    },
    getNodes(state) {
        return state.nodes;
    }

}

const actions = {

    addConceptToConceptMap({commit}, concept) {
        commit('ADD_CONCEPT_TO_CONCEPT_MAP', concept)
    },

    deleteNodeFromConceptMap({commit}, node){
        commit('DELETE_NODE_FROM_CONCEPT_MAP', node);
    },
    /**
     * 
     * @param commit To reach mutation
     * @param nodeId We send the id of the node, which we are 
     * going to delete each link associated with it. 
     */
    deleteLinkFromConceptMap({commit}, nodeId){
        commit("DELETE_LINK_FROM_CONCEPT_MAP", nodeId)
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
        // Adding concept to the state
        
        // We need to control if our concept is already in the map. 
        // Thats why We need the variables below
        let nodesInMap = state.nodes; 
        let isMapConsist = false;
        // If our concept is in map, this loop returns isMapConsist true
        nodesInMap.forEach(node => {
            if(node.id == concept.id) isMapConsist = true;
        });
        // If concept is not in the concept map, we are adding it to the concept map. 
        if(!isMapConsist){
            state.nodes.push({
                id: concept.id,
                name: concept.name,
                uuid: concept.id,        
            })
        }

        // Sending concept to database 
        var data = `{"data": {"type": "node--concept_map", 
        "attributes": {"title": "Concept Map Test"}, 
        "relationships": {"field_conceptmap_concepts" : {"data" : {"type": "node--concept_map", "id": "${concept.id}"} }}}}, 
        `;
    var config = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data
    };
    axios(config)
    .then(function (response) {
        // We need to reload the page here. When we dont do it. It overwrites on the last saved data in state.  
       //  (response) ? location.reload() : "";
        console.log(response);
    })
    .catch(function (error) {
        console.log("Error: ")
        console.log(error)
        console.log(data);
    })

    },
    
    ADD_RELATIONSHIP_TO_CONCEPT_MAP(state, relationship) {
        // adding relationship to the state
        state.links.push({
            id: Math.random() * 1000, 
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: "test" + relationship[0].sid,
        })
        

    },

    DELETE_NODE_FROM_CONCEPT_MAP(state, node){
        let index = state.nodes.indexOf(node);
        state.nodes.splice(index, 1);
        console.log("Hellooooo")
        console.log(state.nodes)
    },
    DELETE_LINK_FROM_CONCEPT_MAP(state, nodeId){
        state.links.forEach(link => {
         
            if(link.sid == nodeId){
                state.links.splice(state.links.indexOf(link), 1);      
            }            
        });

        state.links.forEach(link => {
            if(link.tid == nodeId){
                state.links.splice(state.links.indexOf(link), 1);
            }            
        });
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