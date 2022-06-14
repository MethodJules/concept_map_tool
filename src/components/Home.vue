<template>
  <b-row class="pageContainer">
    <div class="app-loading-bar" v-if="!finishedLoading">
      <b-spinner></b-spinner>
    </div>
    <div v-else>
      <b-row v-if="isThereAnyConceptMap">
        <b-col md="2" class="pageContainer-sidebar">
          <Sidebar />
        </b-col>
        <b-col md="10" class="pageContainer-mapContainer">
          <ConceptMap />
        </b-col>
      </b-row>
      <b-row v-else class="noMapContainer">
        <NoConceptMap />
      </b-row>
    </div>
  </b-row>
</template>
<script>
import ConceptMap from "@/components/ConceptMap.vue";
import Sidebar from "@/components/Sidebar.vue";
import NoConceptMap from "@/components/NoConceptMap.vue";
// import LoadingComponent from "@/components/LoadingComponent.vue";
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {};
  },
  components: {
    ConceptMap,
    Sidebar,
    NoConceptMap,
  },
  computed: {
    ...mapGetters({
      isThereAnyConceptMap: "drupal_api/getIsThereAnyConceptMap",
    }),
    ...mapState("conceptMap", ["finishedLoading"]),
  },

  async created() {
    await this.$store.dispatch("conceptMap/loadConceptMapsFromBackend");
  },
};
</script>
<style scoped>
.pageContainer {
  padding-top: 0.5rem;
  margin: 0;
  flex: 1;
}

.pageContainer-sidebar {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.noMapContainer {
  display: flex;
  align-items: center;
  padding: 0 5%;
}
</style>


