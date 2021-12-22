<template>
  <b-row class="pageContainer">
    <div
      class="app-loading-bar"
      v-if="!finishedActiveConceptMapLoading & isThereAnyConceptMap"
    >
      <b-spinner></b-spinner>
    </div>
    <div>
      <b-row v-if="isThereAnyConceptMap">
        <b-col md="3" class="pageContainer-sidebar">
          <Sidebar />
        </b-col>
        <b-col md="9" class="pageContainer-mapContainer">
          <ConceptMap />
        </b-col>
      </b-row>
      <b-row v-if="!isThereAnyConceptMap" class="noMapContainer">
        <NoConceptMap />
      </b-row>
    </div>
  </b-row>
</template>
<script>
import ConceptMap from "@/components/ConceptMap.vue";
import Sidebar from "@/components/Sidebar.vue";
import NoConceptMap from "@/components/NoConceptMap.vue";
import { mapGetters } from "vuex";
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
      finishedActiveConceptMapLoading: "conceptMap/getFinishedLoading",
    }),
  },
};
</script>
<style scoped>
.pageContainer {
  padding-top: 0.5rem;
  margin: 0;
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


