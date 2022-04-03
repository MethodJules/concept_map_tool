import axios from "@/config/custom_axios";

const state = () => ({
    conceptMap: [],
    finishedLoading: false,
    isConceptMapEmpty: true
})


const getters = {}
const actions = {

    /** Loads concept map from backend. 
    * It takes the concept map from backend and this concept maps stores the ids of nodes and links.
    * It calls another actions to take the datas of the nodes and links. 
    * Then it makes them together and sends it to mutation to save it in state.
    *  @param {object} commit, it is being used to call a mutation
    *  @param {object} state, it allows access to state
    *  @param {object} dispatch, it is being used to call an action
    */
    async loadConceptMapFromBackend({ state, commit, dispatch }, conceptMapId) {
        await axios.get(`concept_map/${conceptMapId}`)
            .then(async (response) => {
                const nodes = response.data.data.relationships.field_conceptmap_concepts.data;
                const links = response.data.data.relationships.field_conceptmap_relationships.data;
                (nodes.length > 0) ? state.isConceptMapEmpty = false : state.isConceptMapEmpty = true;
                let newNodes = await dispatch("loadNodesOfConceptMap", nodes);
                let newLinks = await dispatch("loadLinksOfConceptMap", links);
                await commit("INITIALIZE_CONCEPT_MAP", { conceptMapCredientials: response.data.data, nodes: newNodes, links: newLinks });
            })
            .catch(error => {
                throw new Error(`API ${error}`);
            });

    },

    /**
     * Loads the node data of the concept maps from database.
     * @param {*} state, state as parameter for access and manipulation of state data 
     * @param {*} nodes, it stores the ids of the nodes.  
     * @returns {object} concepts, it stores the concept ids, titles and uuids.
     */
    async loadNodesOfConceptMap({ state }, nodes) {
        console.log(state)
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


}

const mutations = {
    /**
 * Loads concept map to the state. 
 * Loads nodes and link in the required form for vue-d3-network
 * @param {object} state as parameter to access and manipulation of state data 
 * @param {object} conceptMap the concept map that we load from database. 
 */
    INITIALIZE_CONCEPT_MAP(state, conceptMap) {
        state.finishedLoading = true;
        return state.conceptMap.push({
            id: conceptMap.conceptMapCredientials.id,
            title: conceptMap.conceptMapCredientials.attributes.title,
            nodes: conceptMap.nodes,
            links: conceptMap.links,
        })

    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}