<template>
  <div>
    <div v-if="finishedLoading && isEmpty" class="emptyMap">
      <b-card
        bg-variant="info"
        text-variant="white"
        header=""
        class="text-center"
      >
        <b-card-text>Noch kein Konzept vorhanden.</b-card-text>
      </b-card>
    </div>

    <d3-network
      id="map"
      v-if="finishedLoading"
      :net-nodes="conceptMap.nodes"
      :net-links="conceptMap.links"
      :options="options"
      ref="net"
      :link-cb="lcb"
    />

    <div class="markers">
      <svg>
        <defs>
          <marker
            id="m-end"
            markerWidth="10"
            markerHeight="7"
            refX="14"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
          <marker
            id="m-start"
            markerWidth="10"
            markerHeight="7"
            refX="-5"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="10 0, 10 7, 0 3.5" fill="red" />
          </marker>
        </defs>
      </svg>
    </div>
  </div>
</template>
<script>
/**
 * For more information: https://www.npmjs.com/package/vue-d3-network
 * Or just google "vue-d3-network"
 * A good example: https://emiliorizzo.github.io/vue-d3-network/
 *
 */
import D3Network from "vue-d3-network";

import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    D3Network,
  },
  computed: {
    ...mapGetters({
      activeConceptMap: "conceptMap/getActiveConceptMap",
      finishedLoading: "conceptMap/getFinishedLoading",
      isEmpty: "conceptMap/getIsConceptMapEmpty",
      conceptMap: "conceptMap/getConceptMapById",
    }),

    /**
     * options of concept map.
     * For more information: https://www.npmjs.com/package/vue-d3-network
     * Or just google "vue-d3-network"
     */
    options() {
      return {
        nodeLabels: true,
        nodeSize: 25,
        linkWidth: 3,
        force: 10000,
        fontSize: 14,
        strLinks: true,
        linkLabels: true,
      };
    },
  },
  methods: {
    /**
     * Arranges the arrows on the links.
     */
    lcb(link) {
      link._svgAttrs = {
        // "marker-end": `url(#m-end)`,
        "marker-start": `url(#${link.marker_start})`,
        "marker-end": `url(#${link.marker_end})`,
      };
      return link;
    },
  },
  async created() {
    await this.$store.commit(
      "conceptMap/setIdForXnavi",
      this.$route.params.conceptMapId
    );
    await this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
  },
};
</script>
<style scoped>
::v-deep #map svg {
  height: 100vh !important;
}
</style>