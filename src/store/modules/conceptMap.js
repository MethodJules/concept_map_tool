import axios from "@/config/custom_axios";
import loginAxios from "@/config/login_axios"

const state = () => ({
    nodes: [], // stores the nodes of concept map
    concept_maps: [], // Stores the concept maps of the user
    index: 0, // the index of concept_maps. We use it for D3-network in ConceptMap.vue
    activeConceptMap: [], // the selected concept map from radio button which are at the top right of the concept map page
    finishedLoading: false,


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
        // console.log(state.activeConceptMap.nodes);
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
    }


}

const actions = {

    /** Sends concept map to database.
    * It also triggers the action to save it in the user.
    * @param {*} commit, commit is being used to call a mutation
    * @param {*} dispatch, dispatch is being used to call an aciton
    * @param {object} conceptMap,the concept map, to save in database and state
    */
    async createConceptMap({ state, commit, dispatch }, conceptMap) {
        // await commit("CREATE_CONCEPT_MAP", conceptMap)
        // let index = state.concept_maps.indexOf(conceptMap);
        // await commit("UPDATE_INDEX", index);
        var data = `{"data": {"type": "node--concept_map",
        "attributes": {"title": "${conceptMap.title}"}}}`;
        var config = {
            method: 'post',
            url: 'concept_map',
            data: data
        };
        axios(config)
            .then(async (response) => {
                dispatch("addConceptMapToUser", response.data.data)
                conceptMap.id = response.data.data.id;
                await commit("CREATE_CONCEPT_MAP", conceptMap);
                let index = state.concept_maps.indexOf(conceptMap);
                await commit("UPDATE_INDEX", index);
                await commit("UPDATE_AKTIVE_CONCEPT_MAP", index)
            })
            .catch((error) => {
                console.log(error)
            })
    },
    /** Deletes Concept map from database.
    * Commits a mutation to delete it from state
    * Commits a mutation to update active concept map
    * @param {commit} commit to call a mutation
    * @param {rootState} rootState to reach the state of other modules. 
    * @param {object} payload it stores the id of the concept map that we are going to delete 
    */
    deleteConceptMapFromUser({ commit, rootState }, payload) {
        commit("DELETE_CONCEPT_MAP_FROM_STATE", payload);
        commit("UPDATE_AKTIVE_CONCEPT_MAP");
        var data = `{
            "data" : [{
                "type": "node--concept_map",
                "id": "${payload.conceptMap.id}"
            }]
        }`;
        var config = {
            method: 'delete',
            url: `jsonapi/user/user/${rootState.drupal_api.user.id}/relationships/field_concept_maps`,
            headers: {
                'Authorization': rootState.drupal_api.authToken,
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`
            },
            data: data
        };

        loginAxios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })


    },

    /** Deletes concept map from database.
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} conceptMap concept map that we are going to delete from database.  
    */
    deleteConceptMapFromDatabase({ state }, conceptMap) {
        console.log(state);
        var data = `{"data": {"type": "node--concept_map",
        "id": ${conceptMap.id}}}`;
        var config = {
            method: 'delete',
            url: `concept_map/${conceptMap.id}`,
            data: data
        };
        axios(config).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    },

    /** Changes the name of concept map in database. 
    * @param {commit} commit to call mutation 
    * @param {object} payload stores the concept map to change name and the index of it. 
    */
    changeConceptMapName({ commit }, payload) {
        commit("CHANGE_CONCEPT_MAP_NAME", payload)
        var data = `{"data":{"type":"node--concept-map", "id": "${payload.conceptMap.id}", "attributes": {"title": "${payload.newName}"}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${payload.conceptMap.id}`,
            data: data
        };
        axios(config)
    },

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
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error)
            })
    },

    /** Saves concept to the concept map in database 
    * commits to save concepts to the concept map in state.
    * @param {object} concept the concept that will be added to concept map 
    */
    async addConceptToConceptMap({ commit, state }, payload) {
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

                data: data
            };
            axios(config)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error)
                })

        }

        return isMapConsist;

    },

    /** Deletes node from concept map in concept map database and
    * commits to delete node from concept map in state. 
    * @param {object} node the node that will be deleted from concept map.
    */
    deleteNodeFromConceptMap({ commit, state }, payload) {
        commit('DELETE_NODE_FROM_CONCEPT_MAP', payload);
        // Deleting node from concept map in database
        var data = `{"data": [{
            "type": "node--concept", 
            "id": "${payload.node.id}"
        }]}`;
        var config = {
            method: 'delete',
            url: `concept_map/${state.activeConceptMap.id}/relationships/field_conceptmap_concepts`,
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
    deleteLinkFromConceptMapTable({ state }, linkId) {
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}"             
        }]}`;
        var config = {
            method: 'delete',
            url: `concept_map/${state.activeConceptMap.id}/relationships/field_conceptmap_relationships`,
            data: data
        };
        return axios(config).then(async (response) => {
            return response;
        }).catch((error) => {
            console.log(error);
        })
    },

    /** Deletes the link from relations table.
    * @param {object} state it allows access to the state. We dont need it here. 
    * Because of es lint I cannot send an empty variable to the action. Thats why I need to send something with { }
    * @param {string} linkId The id of the link, to be deleted from relations table
    */
    deleteLinkFromRelationsTable({ state }, linkId) {
        // NEED TO REMOVE
        console.log(state);

        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}" 
            
        }]}`;
        var config = {
            method: 'delete',
            url: `relationship/${linkId}`,

            data: data
        };
        axios(config).then((response) => {
            console.log(response);
            console.log("deleted from relations table")
        }).catch((error) => {
            console.log(error);
        })
    },

    /** Adds link to the database.
    * Commits to add links to the concept map.
    * @param {*} commit, commit is being used to call a mutation
    * @param {*} state, state as parameter for access and manipulation of state data
    * @param {object} payload it stores the link that will be added to the concept map 
    */
    addRelationshipToDatabase({ commit, state }, payload) {

        console.log(payload)
        commit('ADD_RELATIONSHIP_TO_STATE', payload)
        var data = `{"data":{
            "type": "node--relationship", 
            "attributes":{"title": "${payload.relationship[0].name}", 
            "field_sid": "${payload.relationship[0].sid}", 
            "field_tid": "${payload.relationship[0].tid}",
            "field_marker": "${payload.relationship[0].marker}" 
        }}}`;
        var config = {
            method: 'post',
            url: 'relationship',
            data: data
        };
        axios(config)
            .then((response) => {
                let newRelationId = response.data.data.id;
                // update the id of the link in state
                state.concept_maps[state.index].links.forEach(link => {
                    if (link.name == payload.relationship[0].name) {
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
                    data: data
                };
                axios(config)
            })
            .catch(function (error) {
                console.log(error)
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

        for (const conceptMap of conceptMaps) {

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
        }
        await commit("INITIALIZE_AKTIVE_CONCEPT_MAP");
    },

    /**
    * Loads the node data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} nodes, it stores the ids of the nodes.  
    * @returns {object} concepts, it stores the concept ids, titles and uuids.
    */
    async loadNodesOfConceptMap({ state }, nodes) {
        console.log(state);

        let concepts = [];
        await nodes.forEach(element => {
            axios.get(`concept/${element.id}`)
                .then((response) => {
                    const title = response.data.data.attributes.title;
                    const uuid = response.data.data.id;
                    const conceptMapId = response.data.data.attributes.field_concept_map_id;
                    concepts.push({ id: uuid, name: title, uuid: uuid, conceptMapId });
                    nodes.push({ id: uuid, name: title, uuid: uuid, conceptMapId });
                })
        });
        return concepts;
    },
    /**
    * Loads the link data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} links, it stores the ids of the links.  
    * @returns {object} concepts, it stores the links ids, names,source ids(sid) and target ids(tid)
    */
    async loadLinksOfConceptMap({ state }, links) {
        // NEED TO REMOVE
        console.log(state)
        let relationships = [];
        await links.forEach(link => {
            axios.get(`relationship/${link.id}`)
                .then((response) => {
                    const label = response.data.data.attributes.title;
                    const id = response.data.data.id;
                    const sid = response.data.data.attributes.field_sid;
                    const tid = response.data.data.attributes.field_tid;
                    const marker = response.data.data.attributes.field_marker;
                    relationships.push({ id: id, sid: sid, tid: tid, _color: '#c93e37', name: label, marker: marker })
                })
        })
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

    addTagToConceptMap({ state }, tags) {
        let conceptMapId = state.activeConceptMap.id;

        var data = `{"data":{"type":"node--concept-map", "id": "${conceptMapId}", "attributes": {"field_conceptmap_tags": ${JSON.stringify(tags)}}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${conceptMapId}`,
            data: data
        };
        axios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })
    },









    deleteTagFromConceptMap({ state }, tags) {
        let conceptMapId = state.activeConceptMap.id;
        let tagsToSend = JSON.stringify(tags);
        console.log(tagsToSend)
        var data = `{"data":{"type":"node--concept-map", "id": "${conceptMapId}", "attributes": {"field_conceptmap_tags": ${tagsToSend}}}}`;
        var config = {
            method: 'patch',
            url: `concept_map/${conceptMapId}`,
            data: data
        };
        axios(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            })

    }
}

const mutations = {
    /**
    * Saves the given concept map to the state.
    * @param {*} state 
    * @param {*} conceptMap 
    */
    CREATE_CONCEPT_MAP(state, conceptMap) {
        return state.concept_maps.push(conceptMap);
    },

    /**
    * Deletes concept map from state.
    * @param {object} state as parameter to access and manipulation of state data  
    * @param {object} payload stores the concept map to delete
    */
    DELETE_CONCEPT_MAP_FROM_STATE(state, payload) {
        state.concept_maps.splice(payload.index, 1);
    },
    /**
    * Changes the name of the concept map in state
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} payload stores the new name and index of the concept map and concept map itself  
    */
    CHANGE_CONCEPT_MAP_NAME(state, payload) {
        state.concept_maps[payload.index].title = payload.newName;
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
        console.log("state.index");
        console.log(state.index);
        state.concept_maps[state.index].nodes.push({
            id: payload.concept.id,
            name: payload.concept.name,
            uuid: payload.concept.id,
        })
        console.log("COncept added")
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
            marker: payload.relationship[0].marker,
        })
        console.log("rel added to state")
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
        console.log(payload)
        console.log(state.concept_maps)
        console.log(state.index)
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


// How will I use it from vue file? 
const functions = {
    deleteLinkFromRelationsTable(linkId) {
        var data = `{"data": [{
            "type": "node--relationship",
            "id": "${linkId}" 
            
        }]}`;
        var config = {
            method: 'delete',
            url: `relationship/${linkId}`,

            data: data
        };
        return axios(config).then((response) => {
            console.log(response);
            console.log("relations table")
        }).catch((error) => {
            console.log(error);
        })

    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    functions
}
