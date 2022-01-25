import axios from "@/config/custom_axios";
import loginAxios from "@/config/login_axios"

const state = () => ({
    nodes: [], // stores the nodes of concept map
    concept_maps: [], // Stores the concept maps of the user
    index: 0, // the index of concept_maps. We use it for D3-network in ConceptMap.vue
    activeConceptMap: [], // the selected concept map from radio button which are at the top right of the concept map page
    finishedLoading: false,
    conceptMapOptions: {
        nodeSize: 30,
        linkWidth: 2,
        force: 30000,
        fontSize: 15,
    },
    idForXNavi: ""


})

const getters = {
    /** Getter for nodes of the concept map.
    * @param {object} state state as parameter for access and manipulation of state data
    * @returns nodes 
    */
    getNodes(state) {
        return state.nodes;
    },

    /** Shows if there is concept in concept map or not. 
    * @param {object} state, state as parameter for access and manipulation of state data
    * @returns result, if concept map is free, then it returns false vice versa.
    * 
    */
    getIsConceptMapEmpty(state) {
        let result = false;
        (state.activeConceptMap.nodes.length == 0) ? result = true : result = false;
        return result;
    },

    /** Getter for concept_maps in state.
    * @param {object} state, state as parameter for access and manipulation of state data 
    * @returns concept_maps, concept maps from state
    */
    getConceptMaps(state) {
        return state.concept_maps;
    },
    /** Getter for index value in state
    * @param {object} state, state as parameter for access and manipulation of state data 
    * @returns index, we are using it in concept_maps array.
    */
    getIndex(state) {
        return state.index;
    },

    /**
    * Getter for active concept map in state. 
    * @param {object} state as parameter to access and manipulation of state data 
    * @returns activeConceptMap, the active concept map that we show to the user. 
    */
    getActiveConceptMap(state) {
        return state.activeConceptMap;
    },
    getFinishedLoading(state) {
        return state.finishedLoading;
    },
    getConceptMapOptions(state) {
        return state.conceptMapOptions;
    },
    getConceptMapById(state) {
        let concept_map = []
        state.concept_maps.forEach(conceptMap => {
            console.log(conceptMap.id)
            conceptMap.id == state.idForXNavi ? concept_map = conceptMap : ""
        });
        console.log(concept_map)
        return concept_map
    }

}

const actions = {



    /** Adds concept map id to the user in database.
    * @param {rootState} rootState, it allows access to states of other modules in store
    * @param {object} conceptMap, the concept map to save to user in database. 
    */
    addConceptMapToUser({ rootState }, conceptMap) {
        let userId = rootState.drupal_api.user.id;
        var data = `{
            "data": [{
                "type": "node--concept_map",
                "id": "${conceptMap.id}"
            }]
        }`;
        var config = {
            method: 'post',
            url: `jsonapi/user/user/${userId}/relationships/field_concept_maps`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`
            },
            data: data
        };
        loginAxios(config)
    },

    /** Saves concept to the concept map in database 
    * commits to save concepts to the concept map in state.
    * @param {object} concept the concept that will be added to concept map 
    */
    async addConceptToConceptMap({ commit, state, rootState }, payload) {
        let id = state.activeConceptMap.id;
        let concept = payload.concept;
        let nodesInMap = state.activeConceptMap.nodes;
        let isMapConsist = false;
        nodesInMap.forEach(node => {
            if (node.id == concept.id) isMapConsist = true;
        });
        if (!isMapConsist) {
            commit('ADD_CONCEPT_TO_CONCEPT_MAP', payload);
            var data = `{"data": [{
                "type": "node--concept", 
                "id": "${concept.id}"
            }]}`;
            var config = {
                method: 'post',
                url: `concept_map/${id}/relationships/field_conceptmap_concepts`,
                data: data,
                headers: {
                    'Authorization': rootState.drupal_api.authToken,
                    'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`
                },

            };
            axios(config)
        }
        return isMapConsist;

    },

    /** Deletes node from concept map in concept map database and
    * commits to delete node from concept map in state. 
    * @param {object} node the node that will be deleted from concept map.
    */
    deleteNodeFromConceptMap({ commit, state, rootState }, payload) {
        commit('DELETE_NODE_FROM_CONCEPT_MAP', payload);
        // Deleting node from concept map in database
        var data = `{"data": [{
            "type": "node--concept", 
            "id": "${payload.node.id}"
        }]}`;
        var config = {
            method: 'delete',
            url: `concept_map/${state.activeConceptMap.id}/relationships/field_conceptmap_concepts`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        axios(config)
    },

    /** Deletes the link from both state and database.
    * Deletes it in both relationships table and concept map table.
    * @param {object} payload it stores the lind ids of the links that we are going to delete from backend.
    * @param {object} state, state as parameter for access and manipulation of state data
    * @param {*} commit, commit is being used to call a mutation
    */
    deleteLinkFromConceptMap({ commit }, payload) {
        commit("DELETE_LINK_FROM_STATE", payload);
    },
    /** Deletes link from concept map table. 
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} linkId the id of the link to be deleted.
    * @returns 
    */
    deleteLinkFromConceptMapTable({ state, rootState }, linkId) {
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}"             
        }]}`;
        var config = {
            method: 'delete',
            url: `concept_map/${state.activeConceptMap.id}/relationships/field_conceptmap_relationships`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data,

        };
        return axios(config).then(async (response) => {
            return response;
        })
    },

    /** Deletes the link from relations table.
    * @param {object} state it allows access to the state. We dont need it here. 
    * Because of es lint I cannot send an empty variable to the action. Thats why I need to send something with { }
    * @param {string} linkId The id of the link, to be deleted from relations table
    */
    deleteLinkFromRelationsTable({ rootState }, linkId) {
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}" 
            
        }]}`;
        var config = {
            method: 'delete',
            url: `relationship/${linkId}`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        axios(config)
    },

    /** Adds link to the database.
    * Commits to add links to the concept map.
    * @param {*} commit, commit is being used to call a mutation
    * @param {*} state, state as parameter for access and manipulation of state data
    * @param {object} payload it stores the link that will be added to the concept map 
    */
    addRelationshipToDatabase({ commit, state, rootState }, payload) {
        commit('ADD_RELATIONSHIP_TO_STATE', payload)
        var data = `{"data":{
            "type": "node--relationship", 
            "attributes":{"title": "${payload.relationship[0].name}", 
            "field_sid": "${payload.relationship[0].sid}", 
            "field_tid": "${payload.relationship[0].tid}",
            "field_marker_start": "${payload.relationship[0].marker_start}", 
            "field_marker_end": "${payload.relationship[0].marker_end}" 
        }}}`;
        var config = {
            method: 'post',
            url: 'relationship',
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': rootState.drupal_api.csrf_token
            },
            data: data
        };
        axios(config)
            .then((response) => {
                let newRelationId = response.data.data.id;
                // update the id of the link in state
                state.concept_maps[state.index].links.forEach(link => {
                    console.log(link)
                    console.log(payload)
                    // if (link.name == payload.relationship[0].name) {
                    //     link.id = response.data.data.id;
                    // }
                    if (link.sid == payload.relationship[0].sid && link.tid == payload.relationship[0].tid) {
                        link.id = response.data.data.id;
                    }
                });
                // Adding Realtionship to our concept map in database
                var data = `{"data": [{
                "type": "node--relationship",
                "id": "${newRelationId}"                
            }]}`;
                var config = {
                    method: 'post',
                    url: `concept_map/${state.activeConceptMap.id}/relationships/field_conceptmap_relationships`,
                    headers: {
                        'Authorization': rootState.drupal_api.authToken,
                        'X-CSRF-Token': rootState.drupal_api.csrf_token
                    },
                    data: data
                };
                axios(config)
            })
    },
    /** Loads concept map from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {*} commit, it is being used to call a mutation
    *  @param {*} rootState, it allows access to states of other modules in store.
    *  @param {*} dispatch, it is being used to call an action
    */
    async loadConceptMapFromBackend({ commit, rootState, dispatch }) {
        let conceptMaps = rootState.drupal_api.user.concept_maps;
        await Promise.all(conceptMaps.map(async conceptMap => {
            await axios.get(`concept_map/${conceptMap.id}`)
                .then(async (response) => {
                    const nodes = response.data.data.relationships.field_conceptmap_concepts.data;
                    const links = response.data.data.relationships.field_conceptmap_relationships.data;
                    const tags = response.data.data.attributes.field_conceptmap_tags;
                    let newNodes = await dispatch("loadNodesOfConceptMap", nodes);
                    let newLinks = await dispatch("loadLinksOfConceptMap", links);
                    await dispatch("loadConceptMap", { conceptMapCredientials: response.data.data, nodes: newNodes, links: newLinks, tags: tags });
                })
                .catch(error => {
                    throw new Error(`API ${error}`);
                });
        }))

        await commit("INITIALIZE_AKTIVE_CONCEPT_MAP");

    },

    /**
    * Loads the node data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} nodes, it stores the ids of the nodes.  
    * @returns {object} concepts, it stores the concept ids, titles and uuids.
    */
    async loadNodesOfConceptMap({ state, dispatch }, nodes) {
        console.log(state)
        let concepts = [];
        await Promise.all(nodes.map(async element => {
            await axios.get(`concept/${element.id}`)
                .then((response) => {
                    console.log(response)
                    const title = response.data.data.attributes.title;
                    const uid = response.data.data.attributes.field_uid;
                    const uuid = response.data.data.id;
                    const conceptMapId = response.data.data.attributes.field_concept_map_id;
                    concepts.push({ id: uuid, name: title, uuid: uuid, conceptMapId, uid });
                    // nodes.push({ id: uuid, name: title, uuid: uuid, conceptMapId });
                })
        }));
        console.log(concepts)
        dispatch("addUidToConcepts", concepts)
        return concepts;
    },


    addUidToConcepts({ rootState }, concepts) {
        let uid = rootState.drupal_api.user.uid;
        concepts.forEach(concept => {
            if (concept.uid == null) {
                var data = `{"data":{"type":"node--concept", "id": "${concept.id}", 
            "attributes": {
                "title": "${concept.name}",
                "field_concept_map_id": "${concept.conceptMapId}",  
                "field_uid" : "${uid}"}}}`;
                var config = {
                    method: 'patch',
                    url: `concept/${concept.id}`,
                    headers: {
                        'Authorization': rootState.drupal_api.authToken,
                        'X-CSRF-Token': rootState.drupal_api.csrf_token
                    },
                    data: data
                };
                axios(config)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }

        })


    },


    /**
    * Loads the link data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} links, it stores the ids of the links.  
    * @returns {object} concepts, it stores the links ids, names,source ids(sid) and target ids(tid)
    */
    async loadLinksOfConceptMap({ state }, links) {
        console.log(state)
        let relationships = [];
        await Promise.all(links.map(async link => {
            await axios.get(`relationship/${link.id}`)
                .then((response) => {
                    const label = response.data.data.attributes.title;
                    const id = response.data.data.id;
                    const sid = response.data.data.attributes.field_sid;
                    const tid = response.data.data.attributes.field_tid;
                    const marker_start = response.data.data.attributes.field_marker_start;
                    const marker_end = response.data.data.attributes.field_marker_end;
                    relationships.push({ id, sid, tid, _color: '#c93e37', name: label, marker_start, marker_end })
                })
        }))
        return relationships;
    },
    /**
    * Sends concept map to mutation to save it in state. 
    * @param {*} commit, it is being used to call a mutation 
    * @param {object} conceptMap, it stores the concept map to save the state 
    * @returns 
    */
    async loadConceptMap({ commit }, conceptMap) {
        return await commit('INITIALIZE_CONCEPT_MAP', conceptMap);
    },
}

const mutations = {



    setIdForXnavi(state, conceptMapId) {
        return state.idForXNavi = conceptMapId
    },


    /**
    * Updates the index value
    * @param {object} state, state as variable to access and manipulation of state data 
    * @param {int} index, the new index to save
    * @returns index, the index value in the state
    */
    UPDATE_INDEX(state, index) {
        state.index = index;
        return state.index;
    },

    /**
    * Adds concept to concept map in state,
    * @param {object} state 
    * @param {object} payload stores the concept data for adding it to concept map. 
    */
    ADD_CONCEPT_TO_CONCEPT_MAP(state, payload) {
        state.concept_maps[state.index].nodes.push({
            id: payload.concept.id,
            name: payload.concept.name,
            uuid: payload.concept.id,
        })
    },
    /**
    * Adds relationships to the concept map in state . 
    * It uses the id in payload, which comes from the response. 
    * @param {object} state 
    * @param {object} payload stores the relationship that will be added to concept map. 
    */
    ADD_RELATIONSHIP_TO_STATE(state, payload) {
        state.concept_maps[state.index].links.push({
            sid: payload.relationship[0].sid,
            tid: payload.relationship[0].tid,
            _color: 'red',
            name: payload.relationship[0].name,
            marker_start: payload.relationship[0].marker_start,
            marker_end: payload.relationship[0].marker_end,
        })
    },

    /**
    * Deletes node from concept map. 
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} payload stores the node that will be deleted from concept map 
    */
    DELETE_NODE_FROM_CONCEPT_MAP(state, payload) {
        let indexOfNode = state.concept_maps[state.index].nodes.indexOf(payload.node);
        state.concept_maps[state.index].nodes.splice(indexOfNode, 1);
    },
    /**
    * Deletes the link from concept map. 
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} payload stores the id of the node which the link associated with it, will be deleted. 
    *  
    */
    DELETE_LINK_FROM_STATE(state, payload) {
        state.concept_maps[state.index].links.forEach(link => {
            if (link.id == payload.linkId) {
                state.concept_maps[state.index].links.splice(state.concept_maps[state.index].links.indexOf(link), 1);
            }
        });
    },

    /**
    * Loads concept map to the state. 
    * Loads nodes and link in the required form for vue-d3-network
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} conceptMap the concept map that we load from database. 
    */
    INITIALIZE_CONCEPT_MAP(state, conceptMap) {
        return state.concept_maps.push({
            id: conceptMap.conceptMapCredientials.id,
            title: conceptMap.conceptMapCredientials.attributes.title,
            nodes: conceptMap.nodes,
            links: conceptMap.links,
            tags: conceptMap.tags
        })




    },
    /**
    * Initializes the active concept map. 
    * @param {object} state, state as parameter to access and manipulation of state data 
    * @returns state.activeConceptMap
    */
    INITIALIZE_AKTIVE_CONCEPT_MAP(state) {
        state.activeConceptMap = state.concept_maps[0];
        state.finishedLoading = true;
        return state.activeConceptMap

    },
    /**
    * Updates the active concept map in state.
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {int} index the index value of the active concept map in concept_maps array  
    */
    UPDATE_AKTIVE_CONCEPT_MAP(state, index) {
        (index) ? state.activeConceptMap = state.concept_maps[index] : state.activeConceptMap = state.concept_maps[0];
    }

}



export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
