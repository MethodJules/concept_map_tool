<template>
    <b-card>
        <b-card-body class="text-center">
            <b-card-title>Concept Mapping Tool</b-card-title>

            <b-card-text>
                Es gibt keinen Konzept Map. Möchten Sie erste Konzept Map
                erstellen?
            </b-card-text>

            <b-row class="buttons">
                <b-input
                    class="card-input"
                    v-model="newConceptMapName"
                    @keydown.enter="createConceptMap(newConceptMapName)"
                >
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
</template>
<script>
export default {
    data() {
        return {
            newConceptMapName: "",
            firstMapCreated: false,
        };
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
                tags: [],
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