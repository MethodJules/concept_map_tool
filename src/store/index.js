import concepts from './modules/concepts'
import concept_map from './modules/concept_map'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
    modules: {
       concepts,
       concept_map,
    }
});