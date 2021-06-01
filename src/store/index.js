import concepts from './modules/concepts'
import concept_map from './modules/concept_map'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
    modules: {
       items,
       concepts,
       project,
       concept_map,
       members,
       daily_scrum,
       reflexion,
       documentation,
       tool,
       todo,
       assistent,
       phases,
       output_documents
    }
});