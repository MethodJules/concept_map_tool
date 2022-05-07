<template>
  <b-row class="pageContainer">
    <div class="app-loading-bar" v-if="!finishedLoading">
      <b-spinner></b-spinner>
    </div>
    <div>
      <b-row v-if="isThereAnyConceptMap">
        <b-col md="2" class="pageContainer-sidebar">
          <Sidebar />
        </b-col>
        <b-col md="10" class="pageContainer-mapContainer">
          <AsyncComponent />
        </b-col>
      </b-row>
      <b-row v-else class="noMapContainer">
        <NoConceptMap />
      </b-row>
    </div>
  </b-row>
</template>
<script>
// import ConceptMap from "@/components/ConceptMap.vue";
import Sidebar from "@/components/Sidebar.vue";
import NoConceptMap from "@/components/NoConceptMap.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { mapGetters, mapState } from "vuex";

const AsyncComponent = () => ({
  // The component to load (should be a Promise)
  component: import("@/components/ConceptMap.vue"),
  // A component to use while the async component is loading
  loading: import("@/components/LoadingComponent.vue"),
  // A component to use if the load fails
  error: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000,
});
export default {
  data() {
    return {};
  },
  components: {
    // ConceptMap,
    Sidebar,
    NoConceptMap,
    AsyncComponent,
  },
  computed: {
    ...mapGetters({
      isThereAnyConceptMap: "drupal_api/getIsThereAnyConceptMap",
    }),
    ...mapState("conceptMap", ["finishedLoading"]),
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


