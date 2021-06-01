<template>
    <div class="scrollbar">
        <vuescroll :ops="ops">
            <div class="listElement" v-for="concept in concepts" :key="concept.name">
                <div class="listIcon" @click="deleteItem(concept)"> <b-icon icon="trash" aria-hidden="true"></b-icon> </div>
                <div class="listName"> {{concept.name}} </div>
                <div class="listArrow" @click="createElement(concept)"> <b-icon icon="arrow-right" aria-hidden="true"></b-icon> </div>
            </div>
        </vuescroll>
    </div>
</template>

<script>
import vuescroll from 'vuescroll';
import { mapState } from 'vuex';

export default {
    components: {
        vuescroll,
    },
    data: function() {
        return {
            conceptList: null,
            ops: {
                    rail: {
                        background: '#bababa',
                        border: '1px solid #000',
                        opacity: 0.5,
                        size: "10px"
                    },
                    bar: {
                        background: 'white',
                        size: "8px",
                        keepShow: true,
                    }
                }
        }
    },
    methods: {
        createElement (value) {
            alert("Create");
            this.$emit('childToParent', value)
            },
        deleteItem(concept) {
            alert("Delete");
            this.$store.dispatch('concepts/deleteConcept', concept)
        }
    },
        computed: {
            ...mapState({
                concepts: state => state.concepts.concepts
            })
           
          /*  
        ...mapState({ 
                concepts(state) {
                    
                    console.log(state.concept_map.nodes);
                    this.conceptList = state.concepts.concepts;

                    for (let concept of state.concepts.concepts) {
                        for (let map of state.concept_map.nodes) {
                            if (concept.id == map.id) {
                                console.log("AAAAAAAAAAAAAAA");
                                console.log(concept.id);
                                console.log(map.id);
                                console.log(this.conceptList.indexOf(concept));
                                this.conceptList.splice(this.conceptList.indexOf(concept), 1);
                            }
                        }
                        
                    }


                    

                    return this.conceptList
                }
        })
        */
    },
    async mounted() {
        console.log("mounted");     
        await this.$store.dispatch('concepts/loadConcepts');
        
        console.log(this.$store.state.concepts.concepts);

        this.conceptList = this.$store.state.concepts.concepts;

        for (let map of this.$store.state.concept_map.nodes) {
            console.log(map);

        }

        for (let concept of this.$store.state.concepts.concepts) {
            console.log(this.$store.state.concept_map.nodes);
            console.log(concept);
            /*
            for (let map of this.$store.state.concept_map.nodes) {
                console.log(concept.id);
                console.log(map.uuid);

                if (concept.id == map.uuid) {
                   
                    console.log(this.conceptList.indexOf(concept));
                    this.conceptList.splice(this.conceptList.indexOf(concept), 1);
                }
            }
            */
        }
        
        
    }
}
</script>