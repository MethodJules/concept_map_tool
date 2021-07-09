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
    addRelationshipToConceptMap({commit}, relationship) {
        commit('ADD_RELATIONSHIP_TO_CONCEPT_MAP', relationship);
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

    //     // Sending concept to database and our concept map ?? 
    //     var data = `{"data": {"type": "node--concept_map", "id": "bd8c18f3-4f03-4787-ac85-48821fa3591f",
         
    //     "relationships": {"field_conceptmap_concepts" : {"data" : {"type": "node--concept", "id": "${concept.id}"} }}} 
    //     `;
    //     var config = {
    //     method: 'post',
    //     url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f',
    //     headers: {
    //         'Accept': 'application/vnd.api+json',
    //         'Content-Type': 'application/vnd.api+json',
    //         'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
    //     },
    //     data: data
    // };
    // axios(config)
    // .then(function (response) {
    //     // We need to reload the page here. When we dont do it. 
    //     // It overwrites on the last saved data in state.  
    //    //  (response) ? location.reload() : "";
    //    console.log("We have send the concept as new concept map")
    //     console.log(response);
   
    // })
    // .catch(function (error) {
    //     console.log("Error: ")
    //     console.log(error)
    //     console.log(data);
    // })

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
        state.links.push({
            id: generatedId, 
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: "test" + relationship[0].sid,
        })
        let newRelationId; 
        
    // Sending relation to the database, but we are sending only a relationship to the database
    // We need to send this relation to the our concept map. 
        var data = `{"data": {"type": "node--relationship", 
        "attributes": {"title": "New Relationship", "field_sid": "${relationship[0].sid}", "field_tid": "${relationship[0].tid}" }}}
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
        console.log("We have send the relationship to the database");
        console.log(response);
        console.log("new relationship id: ");
        console.log(response.data.data.id);
        newRelationId = response.data.data.id;
    })
    .catch(function (error) {
        console.log("Error: ")
        console.log(error)
        console.log(data);
    })


    // // Adding relation to the our concept map ?? 
    //???????????????
        // Sending concept to database and our concept map ?? 
        var data2 = `{"data": {"type": "node--concept_map", "id": "bd8c18f3-4f03-4787-ac85-48821fa3591f",
         
        "relationships": {"field_conceptmap_concepts" : {"data" : {"type": "node--concept", "id": "${relationship[0].sid}"} }}, 
        "field_conceptmap_relationships" : {"data" : {"type": "node--relationship",
        "id": "${newRelationId}"}}
    } 
        `;
        var config2 = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data2
    };
    axios(config2)
    .then(function (response) {
        // We need to reload the page here. When we dont do it. 
        // It overwrites on the last saved data in state.  
       //  (response) ? location.reload() : "";
       console.log("We have send the concept as new concept map")
        console.log(response);
   
    })
    .catch(function (error) {
        console.log("Error: ")
        console.log(error)
        console.log(data);
    })



    },
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
                state.links.splice(state.links.indexOf(link), 1);      
            }            
        });
        
        // Deletes the links that includes nodeId as target id (tid) in it.
        state.links.forEach(link => {
            if(link.tid == nodeId){
                state.links.splice(state.links.indexOf(link), 1);
            }            
        });
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