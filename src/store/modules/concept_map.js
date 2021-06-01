import axios from 'axios';

const state = () => ({
        /*
        nodes: [
            {
                id: 1,
                name: 'Design Science Research'
            },
            {
                id: 2,
                name: 'research paradigm'
            },
            {
                id: 3,
                name: 'interpretive research'
            }
        ],
        links: [
            {sid: 1, tid: 2, _color: '#c93e37'},
            {sid: 2, tid: 3, _color: '#c93e37'}
        ],
        */
       nodes: [],
       links: []
})

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
                //console.log(response);
                //let concept_map = [];
                const data = response.data.data;
                commit('INITIALIZE_CONCEPT_MAP', data);
                //commit('INITIALIZE_CONCEPT_MAP', concept_map);
            }).catch(error => {
                throw new Error(`API ${error}`);
            });
    },


}

const mutations = {
    ADD_CONCEPT_TO_CONCEPT_MAP(state, concept) {
        console.log(concept);
        state.nodes.push({
            id: concept.id,
            name: concept.concept,
            uuid: concept.uuid
        })
        /*
        state.nodes.push({
            id: 99, //TODO: hier muss eine API Abfrage nach einer ID hin
            name: concept.concept
        })*/
    },
    ADD_RELATIONSHIP_TO_CONCEPT_MAP(state, relationship) {
        console.log(relationship);
        state.links.push({
            sid: relationship.source.id,
            tid: relationship.target.id,
            name: relationship.name,
            _color: '#c93e37'
        })
    },
    INITIALIZE_CONCEPT_MAP(state, concept_map) {
        //TODO: Hier kode rein
        //state.nodes = concept_map.nodes; //TODO: Verlinkung
        //state.links = concept_map.relationships;//TODO: Verlinkung
        concept_map.forEach(element => {
            console.log(element);
            const title = element.attributes.title; //Get title
            const concepts = element.relationships.field_conceptmap_concepts.data;
            const relationships = element.relationships.field_conceptmap_relationships.data;
            console.log(`Title: ${title}`)
            //Get concepts of concept map
            console.log(concepts);
            concepts.forEach(element => {
                console.log(element.id); //TODO: Hole title zur uuid
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/concept/${element.id}`)
                    .then((response) => {
                        console.log(response);
                        const title = response.data.data.attributes.title;
                        const id = response.data.data.attributes.drupal_internal__nid;
                        const uuid = response.data.data.id;
                        state.nodes.push({id: id, name: title, uuid: uuid});
                    })
            });

            //Get relationships of concept map
            relationships.forEach(relationship => {
                console.log(relationship.id);
                axios.get(`https://clr-backend.x-navi.de/jsonapi/node/relationship/${relationship.id}`)
                    .then((response) => {
                        console.log(response);
                        const label = response.data.data.attributes.title;
                        const sid = response.data.data.attributes.field_sid;
                        const tid = response.data.data.attributes.field_tid;

                        console.log(`Label: ${label}, SID: ${sid}, TID: ${tid}`);
                        state.links.push({sid: sid, tid: tid, _color: '#c93e37', name: label})
                    })
            })


        });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}