<template>
  <b-button
    size="sm"
    variant="secondary"
    id="copyToClipboard"
    @click="copyToClipboard()"
  >
    <b-tooltip
      target="copyToClipboard"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Konzept Map Link Kopieren</b-tooltip
    >
    <b-icon :icon="copyIcon"></b-icon>
  </b-button>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isDeleteModeOn: false,
      copyIcon: "clipboard",
    };
  },
  computed: {
    ...mapGetters({
      conceptMap: "conceptMap/getActiveConceptMap",
    }),
  },
  methods: {
    /**
     * When we call this method, we can click and delete nodes.
     * It triggers the method changeNodeColor, which changes the color of node.
     */
    copyToClipboard() {
      let conceptMapLink =
        "http://localhost:8080/concept-map/" + this.conceptMap.id;
      // let conceptMapLink =
      //   "https://www.concept-mapping.uni-hildesheim.de/concept-map/" +
      //   this.conceptMap.id;
      navigator.clipboard.writeText(conceptMapLink);
      this.copyIcon = "clipboard-check";
      setTimeout(() => {
        this.$root.$emit("bv::hide::tooltip");
        this.copyIcon = "clipboard";
      }, 2000);
    },
  },
};
</script>