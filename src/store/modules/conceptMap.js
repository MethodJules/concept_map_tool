import axios from "@/config/custom_axios";
import loginAxios from "@/config/login_axios"
import axiosDefault from "axios"

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
    idForXNavi: "",
    test: 12,
    conceptMap: {},
    deleteMode: false,
    transition: true,


})

const getters = {
    // we dont need it. But I keep it for a while to be sure that it is really not needed.
    // getConceptMapById(state) {
    //     let concept_map = []
    //     state.concept_maps.forEach(conceptMap => {
    //         conceptMap.id == state.idForXNavi ? concept_map = conceptMap : ""
    //     });
    //     return concept_map
    // }

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
        let isMapConsist = false
        state.conceptMap.nodes.forEach((node) => {
            if (node.id == payload.concept.id) return isMapConsist = true
        });
        if (!isMapConsist) {
            commit('ADD_CONCEPT_TO_CONCEPT_MAP', payload);
            var data = `{"data": [{
                "type": "node--concept", 
                "id": "${payload.concept.id}"
            }]}`;
            var config = {
                method: 'post',
                url: `concept_map/${state.conceptMap.id}/relationships/field_conceptmap_concepts`,
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
            url: `concept_map/${state.conceptMap.id}/relationships/field_conceptmap_concepts`,
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
            url: `concept_map/${state.conceptMap.id}/relationships/field_conceptmap_relationships`,
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
                let payloadForMutation = {
                    sid: payload.relationship[0].sid,
                    tid: payload.relationship[0].tid,
                    linkId: response.data.data.id
                }

                commit("UPDATE_ID_OF_LINK", payloadForMutation)


                // Adding Realtionship to our concept map in database
                var data = `{"data": [{
                "type": "node--relationship",
                "id": "${response.data.data.id}"                
            }]}`;
                var config = {
                    method: 'post',
                    url: `concept_map/${state.conceptMap.id}/relationships/field_conceptmap_relationships`,
                    headers: {
                        'Authorization': rootState.drupal_api.authToken,
                        'X-CSRF-Token': rootState.drupal_api.csrf_token
                    },
                    data: data
                };
                axios(config)
            })
    },
    /** Loads all concept maps from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {*} commit, it is being used to call a mutation
    *  @param {*} rootState, it allows access to states of other modules in store.
    *  @param {*} dispatch, it is being used to call an action
    */
    async loadConceptMapsFromBackend({ state, commit, rootState, dispatch }) {
        let conceptMaps = rootState.drupal_api.user.concept_maps;
        await Promise.all(conceptMaps.map(async conceptMap => {
            let map = await dispatch("fetchConceptMap", conceptMap.id);
            await commit("SAVE_CONCEPTMAPS_IN_STATE", map);
        }))
        await commit("INITIALIZE_CONCEPT_MAP");
        await commit("CHECK_FOR_OPTIONS", state.conceptMap.nodes)
    },

    /** Loads a single concept map from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {*} commit, it is being used to call a mutation
    *  @param {*} dispatch, it is being used to call an action
    *  @param {integer} conceptMapId, id of the concept map that will be downloaded
    */
    async fetchConceptMap({ commit, dispatch }, conceptMapId) {
        let conceptMap;
        await axios.get(`concept_map/${conceptMapId}`)
            .then(async (response) => {
                const nodes = response.data.data.relationships.field_conceptmap_concepts.data;
                const links = response.data.data.relationships.field_conceptmap_relationships.data;
                const tags = response.data.data.attributes.field_conceptmap_tags;
                let newNodes = await dispatch("loadNodesOfConceptMap", nodes);
                let newLinks = await dispatch("loadLinksOfConceptMap", links);
                conceptMap = { id: response.data.data.id, title: response.data.data.attributes.title, nodes: newNodes, links: newLinks, tags: tags }
                await commit("SAVE_CONCEPTMAP_IN_STATE", conceptMap);
                await commit("CHECK_FOR_OPTIONS", newNodes)
            })
            .catch(error => {
                throw new Error(`API ${error}`);
            });
        return conceptMap;
    },


    /**
    * Loads the node data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} nodes, it stores the ids of the nodes.  
    * @returns {object} concepts, it stores the concept ids, titles and uuids.
    */
    async loadNodesOfConceptMap(ctx, nodes) {

        let concepts = [];
        await Promise.all(nodes.map(async element => {
            await axios.get(`concept/${element.id}`)
                .then((response) => {

                    const title = response.data.data.attributes.title;
                    const uid = response.data.data.attributes.field_uid;
                    const uuid = response.data.data.id;
                    const conceptMapId = response.data.data.attributes.field_concept_map_id;
                    concepts.push({ id: uuid, name: title, uuid: uuid, conceptMapId, uid });
                })
        }));
        return concepts;
    },




    /**
    * Loads the link data of the concept maps from database.
    * @param {*} state, state as parameter for access and manipulation of state data 
    * @param {*} links, it stores the ids of the links.  
    * @returns {object} concepts, it stores the links ids, names,source ids(sid) and target ids(tid)
    */
    async loadLinksOfConceptMap(ctx, links) {
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



    fetchRecommenderLogs() {
        // let logs;
        axiosDefault.get(`https://clr-backend.x-navi.de/jsonapi/recommender_log/recommender_log`)
            .then(async (response) => {
                console.log(response)
            })
            .catch(error => {
                throw new Error(`API ${error}`);
            });

    },

}

const mutations = {

    /**
     * updates the if of the given link.
     * When a link is created in webpage, it is created with a normal id. 
     * But id of the link from backend is needed for later actions.
     * This mutation saves the id from backend to the state.
     * First it finds the correct link by checking source and target id, 
     * then it updates the id of the link.
     * @param {object} state state as parameter for access and manipulation of state data 
     * @param {object} payload it has source and target id of the link
     */
    UPDATE_ID_OF_LINK(state, payload) {
        state.conceptMap.links.forEach(link => {
            if (link.sid == payload.sid && link.tid == payload.tid) {
                link.id = payload.linkId;
            }
        });
    },

    /**
     * Saves concept map in the state.
     * @param {object} state state as parameter for access and manipulation of state data 
     * @param {object} conceptMap concept map to save in state and show.
     */
    SAVE_CONCEPTMAP_IN_STATE(state, conceptMap) {
        state.conceptMap = conceptMap

        state.finishedLoading = true;
        state.transition = true;



    },
    /**
     * Changes the force option for bigger concept maps.
     * @param {object} state state as parameter for access and manipulation of state data 
     * @param {object} nodes nodes of the concept map 
     */
    CHECK_FOR_OPTIONS(state, nodes) {
        (nodes.length > 8) ? state.conceptMapOptions.force = 10000 : state.conceptMapOptions.force = 30000;
    },
    /**
     * Adds given concept map to conceptMaps array in state.
     * @param {object} state state as parameter for access and manipulation of state data 
     * @param {*} conceptMap concept map to save in state
     */
    SAVE_CONCEPTMAPS_IN_STATE(state, conceptMap) {
        state.concept_maps.push(conceptMap)
    },


    /**
     * Saves the idForXNavi in state.
     * @param {object} state state as parameter for access and manipulation of state data 
     * @param {integer} conceptMapId id to set as idForXNavi
     * @returns 
     */
    setIdForXnavi(state, conceptMapId) {
        return state.idForXNavi = conceptMapId
    },


    /**
    * Adds concept to concept map in state,
    * @param {object} state 
    * @param {object} payload stores the concept data for adding it to concept map. 
    */
    ADD_CONCEPT_TO_CONCEPT_MAP(state, payload) {
        state.conceptMap.nodes.push({
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
        state.conceptMap.links.push({
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
        state.conceptMap.nodes.splice(state.conceptMap.nodes.indexOf(payload.node), 1);
    },
    /**
    * Deletes the link from concept map. 
    * @param {object} state as parameter to access and manipulation of state data 
    * @param {object} payload stores the id of the node which the link associated with it, will be deleted. 
    *  
    */
    DELETE_LINK_FROM_STATE(state, payload) {
        state.conceptMap.links.forEach(link => {
            if (link.id == payload.linkId) {
                state.conceptMap.links.splice(state.conceptMap.links.indexOf(link), 1);
            }
        });
    },

    /**
    * Initializes the conceptMap at the first load of the page. 
    * @param {object} state, state as parameter to access and manipulation of state data 
    * @returns state.activeConceptMap
    */
    INITIALIZE_CONCEPT_MAP(state) {
        state.conceptMap = state.concept_maps[0]
        state.finishedLoading = true;

    },

    /**
     * Toggles the delete mode in state.
     * @param {object} state, state as parameter to access and manipulation of state data 
     */
    TOGGLE_DELETE_MODE(state) {
        state.deleteMode = !state.deleteMode;
    },

}



export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}