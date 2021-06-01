<template>
<div class="viewConceptMap">
    <svg >
        <defs>
            <marker id="m-end" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth" >
                <path d="M0,0 L0,6 L9,3 z"></path>
            </marker>

        </defs>
    </svg>
  <d3-network :net-nodes="nodes" :net-links="links" :options="options" :link-cb="lcb" @node-click="foo"></d3-network>
</div>
</template>

<script>
import D3Network from 'vue-d3-network';
import { mapState } from 'vuex';
export default {
    components: {
        D3Network,
    },
    data: function() {
        return {
            options: {
                    force: 4000,
                    nodeSize: 10,
                    nodeLabels: true,
                    linkLabels: true,
                    linkWidth: 2,
                },
        }
    },
    methods: {
        lcb(link) {
            link._svgAttrs = {'marker-end': 'url(#m-end)'}
            return link
        },
        saveToDatabase() {
            console.log(this.nodes)
            console.log(this.links)
            //this.$store.dispatch('saveConceptMapToDB')
        },
        foo(event, node) {
            this.$emit('parentToChild', node);
            console.log(event);
            console.log(node)
        }
    },
    computed: {
        ...mapState({
            nodes: state => state.concept_map.nodes,
            links: state => state.concept_map.links
        })
    }
}
</script>

<style>
#m-end path, #m-start{
  fill: rgba(18, 120, 98, 0.8);
}
.viewConceptMap {
        height: 75%;
        width: 70%;
        position: relative;
        margin-left: auto;
        margin-right: auto;
    }

.net {
    /*border: dashed;*/
    /*border-color: aqua;*/
    position: relative;
    height: 75;
    bottom: 140px;
}

.link-label{
  fill: purple;
  transform: translate(0,.5em);
  font-size: .8em;
}

</style>