import axios from "axios"
const state = () => ({
    nodes: [], // stores the nodes of concept map
    links: [], // stores the links of concept map
})

const getters = {
    /** Getter for nodes of the concept map
     * @returns nodes 
     */
    getNodes(state) {
        return state.nodes;
    },
    /**
     * Getter for Links of the concept map.
     * @returns links 
     * 
     */
    getLinks(state) {
        return state.links;

    },
}

const actions = {
    /**
     * commits to add concepts to the concept map.
     * @param {object} concept the concept that will be added to concept map 
     */
    addConceptToConceptMap({commit}, concept) {
        commit('ADD_CONCEPT_TO_CONCEPT_MAP', concept)
    },
    /**
     * commits to delete node from concept map. 
     * @param {object} node the node that will be deleted from concept map. 
     * 
     */
    deleteNodeFromConceptMap({commit}, node){
        commit('DELETE_NODE_FROM_CONCEPT_MAP', node);
    },
    /**
     * commits to delete the link from concept map. 
     * @param {string} nodeId We send the id of the node, which we are 
     * going to delete each link associated with it. 
     */
    deleteLinkFromConceptMap({commit}, nodeId){
        commit("DELETE_LINK_FROM_CONCEPT_MAP", nodeId)
    },
    /**
     * commits to add links to the concept map.
     * @param {array} relationship the link that will be added to the concept map 
     */
    async addRelationshipToConceptMap({commit}, relationship) {
        commit('ADD_RELATIONSHIP_TO_CONCEPT_MAP', relationship);
        
        // this does not work. It sends id to mutation as an object. I did not understand why. 
        // setTimeout(
        //     () => { 
        //         console.log("New rel ID from state "  + state.newRelId);
        //         let id = state.newRelId;
        //         commit('ADD_RELATIONSHIP_TO_SPECIFIC_CONCEPTMAP', id);
        //     }, 3000 )
    },
    /**
     * Loads concept map from backend. 
     * commit it to mutation to save it in state.
     *  
     */
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
    /**
     * Adds concept to concept map,
     * Both state and database
     * @param {*} state 
     * @param {object} concept concept to add concept map 
     */
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

        // Sending concept to database and our concept map ?? 
        // It is now working. We send the concept to the conept map. 
        var data = `{"data": [ 
                {
                    "type": "node--concept", 
                    "id": "${concept.id}"
                }
            ]
        }
    
        `;
        var config = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_concepts',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data
    };
    axios(config)
    .then(function () {
     
    //    console.log("Workingggg.... We have send the concept as new concept map Concept Sending")
    //     console.log(response);
   
    })
    .catch(function (error) {
        console.log("Concept Sending Error: ")
        console.log(error)
    })

    },
    /**
     * Adds relationships to the concept map. 
     * Both state and database
     * @param {*} state 
     * @param {array} relationship the relationship that will be added to concept map. 
     */
    ADD_RELATIONSHIP_TO_CONCEPT_MAP(state, relationship) {
    
        // adding relationship to the state
        let generatedId = Math.random() * 1000; 
        let name =  "REL" + relationship[0].sid + "&" + relationship[0].tid;
        state.links.push({
            id: generatedId, 
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: name,
        })
        var newRelationId; 
        
    // Sending relation to the database, but we are sending only a relationship to the database
    // We need to send this relation to the our concept map.
    // We do it in setTimeout. Because we need the id of the new relationship.  
        var data = `{
            "data": 
            {
                "type": "node--relationship", 
                "attributes": 
                {
                    "title": "${name}", 
                    "field_sid": "${relationship[0].sid}", 
                    "field_tid": "${relationship[0].tid}" 
                }
            }
        }
        `;
        var config = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/relationship',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data
    };
    axios(config)
    .then(function (response) {
    
        newRelationId = response.data.data.id;
        console.log("NEW REL ID in then: " + newRelationId);
    })
    .catch(function (error) {
        console.log("Error: ")
        console.log(error)
    })

    
    setTimeout(() => {

// We need newRelationId to send our relationship to the our concept map. 
// To wait the process above I have used setTimeout. But I feel that it is not
// the proper solution. I could not make this process asyncron in another way.
// Is it possible to make it differently?
 

        // Sending Relationship to our concept map ?? 
        var data2 = `{
            "data": [
                {
                    "type": "node--relationship",
                    "id": "${newRelationId}"                
                }
            ]
        }
        `;
        var config2 = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data2
    };
    axios(config2)
    .then(function (response) {
       console.log("We have send the RELATIONSHIP to our concept map")
        console.log(response);
   
    })
    .catch(function (error) {
        console.log("REL SENDING ERROR: ")
        console.log(error)
    })

    }, 3000);

    },

    // OUT OF USE. JUST  KEEPING IT TO ASK QUESTION ABOUT IT
    // I have tried to call this mutation with settimeout in action addRelationshipToConceptMap but
    // it takes newRelationId as an object. I dont understand why. Thats why we are not using it. 
    // We have done the delay in add_relationship_to_conceptmap with set time out. 
    // 
    // ADD_RELATIONSHIP_TO_SPECIFIC_CONCEPTMAP(newRelationId){
    //     console.log("specific rel adding: " + newRelationId);
    //     // Adding Realtionship to our concept map ?? 
    //     var data2 = `{
    //         "data": [
    //             {
    //                 "type": "node--relationship",
    //                 "id": "${newRelationId}"                
    //             }
    //         ]
    //     }
    //     `;
    //     var config2 = {
    //     method: 'post',
    //     url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships',
    //     headers: {
    //         'Accept': 'application/vnd.api+json',
    //         'Content-Type': 'application/vnd.api+json',
    //         'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    //     },
    //     data: data2
    // };
    // axios(config2)
    // .then(function (response) {
    //    console.log("We have send the RELATIONSHIP to our concept map")
    //     console.log(response);
   
    // })
    // .catch(function (error) {
    //     console.log("REL SENDING ERROR: ")
    //     console.log(error)
    // })
    // },


    /**
     * Deletes node from concept map. 
     * @param {*} state 
     * @param {object} node the node that will be deleted from concept map 
     */
    DELETE_NODE_FROM_CONCEPT_MAP(state, node){
        let index = state.nodes.indexOf(node);
        state.nodes.splice(index, 1);
        console.log("Hellooooo")
        console.log(state.nodes)

        // Deleting node from concept map
        var data = `{"data": [ 
            {
                "type": "node--concept", 
                "id": "${node.id}"
            }
        ]
    }

    `;
    var config = {
    method: 'delete',
    url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_concepts',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
    data: data
};
axios(config)
.then(function (response) {
 
   console.log("Workingggg.... We have send the concept as new concept map Concept Sending")
    console.log(response);

})
.catch(function (error) {
    console.log("Concept DELETE Error: ")
    console.log(error)
})


    },
    /**
     * Deletes the link from concept map. 
     * @param {*} state 
     * @param {String} nodeId The id of the node which the link associated with it, will be deleted. 
     *  
     */
    DELETE_LINK_FROM_CONCEPT_MAP(state, nodeId){
        // Deletes the links that includes nodeId as source id (sid) in it.
        state.links.forEach(link => {
            
            if(link.sid == nodeId){
                // Delete from state
                state.links.splice(state.links.indexOf(link), 1);      
            }            
        });
        
        // Deletes the links that includes nodeId as target id (tid) in it.
        state.links.forEach(link => {
            if(link.tid == nodeId){
                state.links.splice(state.links.indexOf(link), 1);
            }            
        });

                // DELETE REL FROM DB
 // Deleting relation from the database, but we delete only the relationship from the database
    // We need to delete this relation also from our concept map.
    var data = `{
        "data": 
        {
            "type": "node--relationship",
            "id": "${nodeId}", 
           
        }
    }
    `;
    var config = {
    method: 'delete',
    url: 'https://clr-backend.x-navi.de/jsonapi/node/relationship',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
    data: data
};
axios(config)
.then(function (response) {

    
    console.log("REL deleted from DB:  " + response);
})
.catch(function (error) {
    console.log("REL not deleted from db Error: ")
    console.log(error)
})



// We need newRelationId to send our relationship to the our concept map. 
// To wait the process above I have used setTimeout. But I feel that it is not
// the proper solution. I could not make this process asyncron in another way.
// Is it possible to make it differently?


    // Sending Relationship to our concept map ?? 
    var data2 = `{
        "data": [
            {
                "type": "node--relationship",
                "id": "${nodeId}"                
            }
        ]
    }
    `;
    var config2 = {
    method: 'delete',
    url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    },
    data: data2
};
axios(config2)
.then(function (response) {
   console.log("We have deleted the RELATIONSHIP from our concept map")
    console.log(response);

})
.catch(function (error) {
    console.log("REL deleteign from concept map ERROR: ")
    console.log(error)
})




    },


    /**
     * Loads concept map to the state
     * Loads nodes and link in the required form for vue-d3-network
     * @param {*} state 
     * @param {object} concept_map teh concept map that we load from database. 
     */
    INITIALIZE_CONCEPT_MAP(state, concept_map) {
        //TODO: Hier kode rein
        //state.nodes = concept_map.nodes; //TODO: Verlinkung
        //state.links = concept_map.relationships;//TODO: Verlinkung
        concept_map.forEach(element => {
            const concepts = element.relationships.field_conceptmap_concepts.data;
            const relationships = element.relationships.field_conceptmap_relationships.data;
            
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
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/relationship/${relationship.id}`)
                    .then((response) => {

                        const label = response.data.data.attributes.title;
                        const sid = response.data.data.attributes.field_sid;
                        const tid = response.data.data.attributes.field_tid;
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