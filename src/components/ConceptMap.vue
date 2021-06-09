<template>
  <div>
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
  </div>
</template>
<script>
import D3Network from "vue-d3-network";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      options: {
        force: 3000,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 5,
      },
    };
  },
  components: {
    D3Network,
  },
  computed: {
    ...mapGetters({
      links: "conceptMap/getLinks",
      nodes: "conceptMap/getNodes",
    }),
  },
};
</script>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>