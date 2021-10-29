<template>
    <b-row class="pageContainer">
        <b-row v-if="isThereAnyConceptMap">
            <b-col md="2" class="pageContainer-sidebar">
                <Sidebar />
            </b-col>
            <b-col md="10" class="pageContainer-mapContainer">
                <ConceptMap />
            </b-col>
        </b-row>
        <b-row v-if="!isThereAnyConceptMap" class="noMapContainer">
            <b-card>
                <b-card-body class="text-center">
                    <b-card-title>Concept Mapping Tool</b-card-title>

                    <b-card-text>
                        Es gibt keinen Konzept Map. Möchten Sie erste Konzept
                        Map erstellen?
                    </b-card-text>

                    <b-row class="buttons">
                        <b-input class="card-input" v-model="newConceptMapName">
                        </b-input>
                        <b-button
                            variant="secondary"
                            @click="createConceptMap(newConceptMapName)"
                            class="card-button"
                        >
                            Erstelle Erste Konzept Map
                        </b-button>
                    </b-row>
                </b-card-body>
            </b-card>
        </b-row>
    </b-row>
</template>
<script>
import ConceptMap from "@/components/ConceptMap.vue";
import Sidebar from "@/components/Sidebar.vue";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            newConceptMapName: "",
        };
    },
    components: {
        ConceptMap,
        Sidebar,
    },
    computed: {
        ...mapGetters({
            isThereAnyConceptMap: "drupal_api/getIsThereAnyConceptMap",
        }),
    },
    methods: {
        /**
         * Creates new concept map.
         * @param {string} newConceptMapName, the name of the new concept map.
         */
        createConceptMap(newConceptMapName) {
            console.log(newConceptMapName);
            let newConceptMap = {
                title: newConceptMapName,
                nodes: [],
                links: [],
            };
            this.$store.dispatch(
                "conceptMapBar/createConceptMap",
                newConceptMap
            );

            this.newConceptMapName = "";
        },
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
.noMapContainer {
    display: flex;
    align-items: center;
    height: 90vh;
    padding: 0 5%;
}

.buttons {
    display: flex;

    justify-content: center;
}
.card-input {
    width: 20%;
}
.card-button {
    width: 20%;
}
</style>


