import axios from "@/config/custom_axios";

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
    * Saves concept to the concept map in database 
    * commits to save concepts to the concept map in state.
    * @param {object} concept the concept that will be added to concept map 
    */
    addConceptToConceptMap({commit, state}, concept) {
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
            // send it to mutations to save to the state
            commit('ADD_CONCEPT_TO_CONCEPT_MAP', concept);
            // save to db
            // It is now working. We send the concept to the conept map. 
            var data = `{"data": [{
                "type": "node--concept", 
                "id": "${concept.id}"
            }]}`;
            var config = {
                method: 'post',
                url: 'concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_concepts',
                
                data: data
            };
            axios(config)
            .then(function (response) { 
                console.log(response);    
            })
            .catch(function (error) {
                console.log(error)
            })
            
        }
        
    }, 
    /**
    * Deletes node from concept map in concept map database and
    * commits to delete node from concept map in state. 
    * @param {object} node the node that will be deleted from concept map. 
    * 
    */
    deleteNodeFromConceptMap({commit}, node){
        commit('DELETE_NODE_FROM_CONCEPT_MAP', node);
        // Deleting node from concept map in database
        var data = `{"data": [{
            "type": "node--concept", 
            "id": "${node.id}"
        }]}`;
        var config = {
            method: 'delete',
            url: 'concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_concepts',
            data: data
        };
        axios(config)        
    },
    
    /**
    * Deletes the link from both state and database.
    * Deletes it in both relationships table and concept map table.
    * At the end it controls if there is a link with id missing created.
    * It somehow creates links with id "missing". I could not prevent it. 
    * I have tried to make this process in seperate actions and functions and try to call them
    * in an order with then blocks. I have tried to delete first from concept map and then in relationship table
    * But somehow it creates the links with id missing in concept map table. I could not prevent it.
    * So as a solution the function checks at the end if they are created and delete them immediately.
    * @param {string} linkId the id of the link that we are going to delete 
    */
    deleteLinkFromConceptMap({commit}, linkId){
        // state delete
        commit("DELETE_LINK_FROM_STATE", linkId);
        
        // Delete relationship from Concept map in database
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}"             
        }]}`;
        var config = {
            method: 'delete',
            url: `concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships`,
            
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
            var data2 = `{"data": [{
                "type": "node--relationship",
                "id": "${linkId}" 
                
            }]}`;
            var config2 = {
                method: 'delete',
                url: `relationship/${linkId}`,
                
                data: data2
            };
            axios(config2)
            .then(function (response) {
                console.log(response);
                
                // Check if there is a missing created and delete it.
                var data = `{"data": [{
                    "type": "node--relationship",
                    "id": "missing"                             
                }]}`;
                var config = {
                    method: 'delete',
                    url: `concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships`,
                    
                    data: data
                };
                axios(config)
                .then(function (response) {
                    console.log("missing deleted")
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
        
    },
    
    /**
    * commits to add links to the concept map.
    * @param {array} relationship the link that will be added to the concept map 
    */
    addRelationshipToDatabase({commit, state}, relationship) {
        // send it to state
        commit('ADD_RELATIONSHIP_TO_STATE', relationship)
        var data = `{"data":{
            "type": "node--relationship", 
            "attributes":{"title": "${relationship[0].name}", 
            "field_sid": "${relationship[0].sid}", 
            "field_tid": "${relationship[0].tid}" 
        }}}`;
        var config = {
            method: 'post',
            url: 'relationship',
            data: data
        };
        axios(config)
        .then(function (response) {
            // we need to save the id of the relationship to the state.
            // We will use the id when we delete it. 
            // Now there is an id like "link-0" in state. We cannot delete relationship with this id. 
            // Thats why we send it to state here.
            
            // I cant send the newRelationId to mutation. Thats why I am doing it here.
            // commit('ADD_RELATIONSHIP_TO_DATABASE', relationship, response.data.data.id);
            let newRelationId = response.data.data.id;
            // update the id of the link in state
            state.links.forEach(link => {
                if(link.name == relationship[0].name){
                    link.id = response.data.data.id;
                    console.log("new id")
                    console.log(response.data.data.id);
                }
                
            });
            // Adding Realtionship to our concept map in database
            var data = `{"data": [{
                "type": "node--relationship",
                "id": "${newRelationId}"                
            }]}`;
            var config = {
                method: 'post',
                url: 'concept_map/bd8c18f3-4f03-4787-ac85-48821fa3591f/relationships/field_conceptmap_relationships',
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
    },
    /**
    * Loads concept map from backend. 
    * commit it to mutation to save it in state.
    *  
    */
    async loadConceptMapFromBackend({commit}) {
        await axios.get('concept_map')
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
        state.nodes.push({
            id: concept.id,
            name: concept.name,
            uuid: concept.id,        
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
    ADD_RELATIONSHIP_TO_STATE(state, relationship) {  
        state.links.push({
            sid: relationship[0].sid,
            tid: relationship[0].tid,
            _color: '#FFFFFF', 
            name: relationship[0].name,
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
        
    },
    /**
    * Deletes the link from concept map. 
    * @param {*} state 
    * @param {String} nodeId The id of the node which the link associated with it, will be deleted. 
    *  
    */
    
    DELETE_LINK_FROM_STATE(state, id){
        // Delete relationship from state
        state.links.forEach(link => {     
            if(link.id == id){
                // Delete from state
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
                axios.get(`concept/${element.id}`)
                .then((response) => {
                    const title = response.data.data.attributes.title;
                    const uuid = response.data.data.id;
                    state.nodes.push({id: uuid, name: title, uuid: uuid});
                })
                
            });
            
            relationships.forEach(relationship => {
                axios.get(`relationship/${relationship.id}`)
                .then((response) => {
                    const label = response.data.data.attributes.title;
                    const id = response.data.data.id;
                    const sid = response.data.data.attributes.field_sid;
                    const tid = response.data.data.attributes.field_tid;
                    state.links.push({ id: id, sid: sid, tid: tid, _color: '#c93e37', name: label})
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
