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
    /** Get if there is concept in map
    * @returns result, if concept map is free, then it returns false vice versa.
    * 
    */
    getIsConceptMapEmpty(state){
        let result = false;
        (state.nodes.length == 0) ? result =  true : result = false; 
        return result;
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
    addRelationshipToDatabase({commit}, relationship) {
        commit('ADD_RELATIONSHIP_TO_DATABASE', relationship);
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
    .then(function (response) { 
        console.log(response);    
    })
    .catch(function (error) {
        console.log(error)
    })
    
},
/**
* Adds relationships to the concept map. 
* Both state and database
* It saves first to the database and then saves relationship to state by using the id 
* that comes with response.
* @param {*} state 
* @param {array} relationship the relationship that will be added to concept map. 
*/
ADD_RELATIONSHIP_TO_DATABASE(state, relationship) { 
    var data = `{
        "data": 
        {
            "type": "node--relationship", 
            "attributes": 
            {
                "title": "${relationship[0].name}", 
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
        // We need the id of the saved relationship to save it to the concept map. 
        // Thats why I have done it in then {}..
        let newRelationId = response.data.data.id;
        // Adding Realtionship to our concept map 
        var data = `{
            "data": [
                {
                    "type": "node--relationship",
                    "id": "${newRelationId}"                
                }
            ]
        }
        `;
        var config = {
            method: 'post',
            url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
            },
            data: data
            
        };
        axios(config)
        .then(function (response) {
            console.log(response);
            
        })
        .catch(function (error) {
            console.log(error)
        })
        
        // we need to save the id of the relationship to the state.
        // We will use the id when we delete it. 
        // Now there is an id like "link-0" in state. We cannot delete relationship with this id. 
        // Thats why we send it to state here. 
        state.links.push({
            id: newRelationId, 
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: relationship[0].name,
        })       
    })
    .catch(function (error) {
        console.log(error)
    })
},
/**
* Deletes node from concept map. 
* @param {*} state 
* @param {object} node the node that will be deleted from concept map 
*/
DELETE_NODE_FROM_CONCEPT_MAP(state, node){
    // delete node in state
    let index = state.nodes.indexOf(node);
    state.nodes.splice(index, 1);
    // Deleting node from concept map
    var data = `{"data": [ 
        {
            "type": "node--concept", 
            "id": "${node.id}"
        }
    ]
}`;
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
    console.log(response);
})
.catch(function (error) {
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
    // Delete relationship from state
    // Deletes the links that includes nodeId as source id (sid) in it.
    let linkId = []; 
    state.links.forEach(link => {       
        if(link.sid == nodeId){
            // Delete from state
            state.links.splice(state.links.indexOf(link), 1); 
            linkId.push(link.id);   
        }            
    });
    
    // Deletes the links that includes nodeId as target id (tid) in it.
    state.links.forEach(link => {
        if(link.tid == nodeId){
            state.links.splice(state.links.indexOf(link), 1);
            linkId.push(link.id);  
        }            
    });
    // Delete relationship from Concept map in database
    linkId.forEach(id => {
        var data = `{
            "data": [
                {
                    "type": "node--relationship",
                    "id": "${id}"             
                }
            ]
        }`;
        var config = {
            method: 'delete',
            url: `https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            console.log(response);
            // Delete relationship from relationships in db
            // We need to delete relationship from relationship table after we delete it from conceptmap
            // Thats why we make it here
            // But it does not do it in order. Thats why we had to do many extra work. 
            // It creates relationship with no reference in conceptmap.json file. 
            // We delete them regularly when we initialize the concept map and after this delete process. 
            // If we could make it here in order. Then we would be released so much work.  
            var data2 = `{
                "data": [
                    {
                        "type": "node--relationship",
                        "id": "${id}" 
                        
                    }
                ]
            }`;
            var config2 = {
                method: 'delete',
                url: `https://clr-backend.x-navi.de/jsonapi/node/relationship/${id}`,
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                },
                data: data2
            };
            axios(config2)
            .then(function (response) {
                console.log(response);
                
                // Check if there is a missing created and delete it.
                var data = `{
                    "data": [
                        {
                            "type": "node--relationship",
                            "id": "missing"                             
                        }
                    ]
                }`;
                var config = {
                    method: 'delete',
                    url: `https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships`,
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                    },
                    data: data
                };
                axios(config)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error)
                })
                
            })
            .catch(function (error) {
                console.log(error)
            })            
        })
        .catch(function (error) {  
            console.log(error)
        })
        
    });
},


/**
* Loads concept map to the state
* Loads nodes and link in the required form for vue-d3-network
* Also it controls if the conceptmap.json file is broken or not. 
* Somehow we may create relationship with no reference. 
* They are kept with id=missing.
* It checks for such data and delete them. 
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
            axios.get(`https://clr-backend.x-navi.de/jsonapi/node/concept/${element.id}`)
            .then((response) => {
                const title = response.data.data.attributes.title;
                const uuid = response.data.data.id;
                state.nodes.push({id: uuid, name: title, uuid: uuid});
            })
            
        });
        //Get relationships of concept map
        relationships.forEach(relationship => {
            if(relationship.id == "missing"){
                
                // Delete rel mit id=missing from concept map
                // These are created sometimes when I delete a relationship. 
                // A miserable solution I think...
                var data = `{
                    "data": [
                        {
                            "type": "node--relationship",
                            "id": "missing" 
                            
                        }
                    ]
                }`;
                var config = {
                    method: 'delete',
                    url: `https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships`,
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                    },
                    data: data
                };
                axios(config)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error)
                })
            }else{
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/relationship/${relationship.id}`)
                .then((response) => {
                    const label = response.data.data.attributes.title;
                    const id = response.data.data.id;
                    const sid = response.data.data.attributes.field_sid;
                    const tid = response.data.data.attributes.field_tid;
                    state.links.push({ id: id, sid: sid, tid: tid, _color: '#c93e37', name: label})
                })
            }
            
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
