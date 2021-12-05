<template>
    <b-card>
        <b-card-body class="text-center">
            <b-card-title>Concept Mapping Tool</b-card-title>

            <b-card-text>
                Es gibt noch keine Concept Map. Möchtest du deine erste Concept
                Map erstellen?
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
                    Erstelle deine erste Concept Map
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
            if (newConceptMapName.length > 0) {
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
            } else {
                alert("Sie müssen eine Concept Map Name eingeben..");
            }
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