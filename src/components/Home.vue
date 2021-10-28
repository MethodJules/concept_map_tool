<template>
    <b-row class="pageContainer" v-if="isThereAnyConceptMap">
        <b-col md="2" class="pageContainer-sidebar">
            <Sidebar />
        </b-col>
        <b-col md="10" class="pageContainer-mapContainer">
            <ConceptMap />
        </b-col>
    </b-row>
</template>
<script>
import ConceptMap from "@/components/ConceptMap.vue";
import Sidebar from "@/components/Sidebar.vue";
import { mapGetters } from "vuex";
export default {
    components: {
        ConceptMap,
        Sidebar,
    },
    computed: {
        ...mapGetters({
            isThereAnyConceptMap: "drupal_api/getIsThereAnyConceptMap",
        }),
    },
};
</script>
<style scoped>
.pageContainer {
    padding: 0.5rem;
    margin: 0;
}

.pageContainer-sidebar {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 90vh;
}
.pageContainer-mapContainer {
    height: 90vh;
}
</style>


