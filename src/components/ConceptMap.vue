<template>
    <div>
        <b-modal id="add-parent-modal" hide-footer hide-header hide-title>
            <div class="modal-container">
                <h5 class="modal-title">
                    Add a parent to <strong> {{ clickedNode.name }} !</strong>
                </h5>
                <div class="modal-body">
                    <p>
                        Choose one of the below
                        <b-button
                            variant="secondary"
                            size="sm"
                            @click="clearOptions()"
                            >Clear Options</b-button
                        >
                    </p>
                    <select v-model="targetConcept">
                        <option value="" disabled selected hidden>
                            Choose Concept...
                        </option>
                        <option
                            v-for="(concept, i) in concepts"
                            :key="i"
                            :value="concept"
                            :disabled="isInputFull"
                        >
                            {{ concept.name }}
                        </option>
                    </select>

                    <div class="modal-buttons">
                        <b-button
                            @click="
                                removeConceptFromConceptMap(clickedNode, links)
                            "
                            variant="danger"
                            size="sm"
                        >
                            Delete <strong> {{ clickedNode.name }} !</strong>
                        </b-button>
                        <div>
                            <b-button
                                variant="primary"
                                :disabled="isOptionOrInputFull"
                                size="sm"
                                @click="
                                    addConceptToConceptMap(
                                        clickedNode,
                                        targetConcept
                                    )
                                "
                                >Hinzufügen
                            </b-button>
                            <b-button
                                @click="hideModal()"
                                variant="danger"
                                size="sm"
                                >Close Me
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>
        <div>
            <div class="radioButtons">
                <div v-for="(conceptMap, i) in conceptMaps" :key="i">
                    <input
                        type="radio"
                        class="btn-check"
                        name="options"
                        checked
                        :id="i"
                        autocomplete="off"
                        @click="conceptMapSelect(conceptMap, i)"
                    />
                    <label class="btn btn-outline-primary btn-sm" :for="i">
                        {{ conceptMap.title }}</label
                    >
                </div>
            </div>

            <d3-network
                :net-nodes="conceptMaps[index].nodes"
                :net-links="conceptMaps[index].links"
                :options="options"
                @node-click="showModal"
                @link-click="changeColor"
            />
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
        return {
            // variables for link options:
            nodeSize: 30, // Link Options: arranges the size of nodes
            linkWidth: 5, // Link Options: arranges the size of the link
            force: 5000, // Link Options: arranges how much wide the concept map
            fontSize: 15, // Link Options: arranges the font size of the node
            strLinks: true, // Link Options: decide if the links are straight or curved
            clickedNode: {}, // the node that user clicked on the concept map
            targetConcept: "", // The concept that we are going to add to the map
            newConceptToAdd: "", // New concept to add map and concept list
            highlightNodes: [],
        };
    },
    components: {
        D3Network,
    },
    computed: {
        // Getters for link concepts and nodes.
        // The values taken form state.
        ...mapGetters({
            links: "conceptMap/getLinks",
            nodes: "conceptMap/getNodes",
            deleteMode: "getDeleteMode",
            concepts: "getConcepts",
            conceptMaps: "conceptMap/getConceptMaps",
            index: "conceptMap/getIndex",
        }),

        /**
         * It controls if option or input is full or not.
         * We need this info in order to prevent sending an unfilled form
         */
        isOptionOrInputFull() {
            if ((this.targetConcept == "") & (this.newConceptToAdd == "")) {
                return true;
            }
            return false;
        },
        /**
         * It controls if option is full or not
         * We disable the input if option is full.
         * Otherweise we send extra info to our methodes.
         */
        isOptionFull() {
            if (this.targetConcept !== "") return false;
            return true;
        },
        /**
         * It controls if input is full or not
         * We disable the options if input is full.
         * Otherweise we send extra info to our methodes.
         */
        isInputFull() {
            if (this.newConceptToAdd !== "") return true;
            return false;
        },
        /**
         * options of concept map.
         * For more information: https://www.npmjs.com/package/vue-d3-network
         * Or just google "vue-d3-network"
         */
        options() {
            return {
                force: this.force,
                nodeSize: this.nodeSize,
                nodeLabels: true,
                linkWidth: this.linkWidth,
                fontSize: this.fontSize,
                strLinks: this.strLinks,
                // size: { h: 700 },
            };
        },
    },
    methods: {
        conceptMapSelect(conceptMap, index) {
            this.$store.state.conceptMap.index = index;
            this.$store.state.conceptMap.aktive_concept_map = conceptMap;
        },

        /**
         * Show Modal.
         * @param node The node that user clicked
         * It shows the modal when user clicked a node.
         * Modal is specialized according to the node clicked,
         * If deleteMode is on, it deletes the node clicked.
         */
        showModal(event, node) {
            if (this.deleteMode) {
                this.removeConceptFromConceptMap(node);
            } else {
                this.$root.$emit("bv::show::modal", "add-parent-modal");
                this.clickedNode = node;
            }
        },
        /**
         * Hide Modal.
         * Hides modal when this methode is called.
         */
        hideModal() {
            this.$root.$emit("bv::hide::modal", "add-parent-modal");
        },
        /**Clear Options.
         * Deletes the value of the option in the modal.
         * targetConcept stores tha values of the option in the modal
         */
        clearOptions() {
            this.targetConcept = "";
        },
        /**
         * Adds given concept to concept map
         * @param sourceConcept The source concept as an object
         * @param targetConcept The target concept as an object
         *
         */
        addConceptToConceptMap(sourceConcept, targetConcept) {
            let relationship = [];

            // We need to add the ids of the source and target concept to relationship array.
            relationship.push({
                name: sourceConcept.name + " -&- " + targetConcept.name,
                tid: targetConcept.id,
                sid: sourceConcept.id,
            });
            // We need to send the relationship as an array
            this.$store.dispatch("conceptMap/addRelationshipToDatabase", {
                relationship: relationship,
            });
            // We need to send the source concept as an object to this methode
            this.$store.dispatch("conceptMap/addConceptToConceptMap", {
                concept: sourceConcept,
            });
            // we need to send target concept as an object to this methode
            this.$store.dispatch("conceptMap/addConceptToConceptMap", {
                concept: targetConcept,
            });
        },
        /**
         * Remove Concept From Concept Map.
         * @param node The node that we are going to delete from concept map.
         * This method both deletes the concept and the link that are associated with
         * this node.
         */
        removeConceptFromConceptMap(node) {
            // Removes the node that is send to the methode
            this.$store.dispatch("conceptMap/deleteNodeFromConceptMap", {
                node: node,
            });
            // removes the link that associated with the node send.
            // Find the link related with given node and delete them
            let linkIds = [];
            console.log(this.$store.state);
            let links =
                this.$store.state.conceptMap.concept_maps[
                    this.$store.state.conceptMap.index
                ].links;

            links.forEach((link) => {
                link.sid == node.id || link.tid == node.id
                    ? linkIds.push(link.id)
                    : "";
            });
            console.log(linkIds);
            if (linkIds.length > 0) {
                linkIds.forEach((linkId) => {
                    console.log("link send");
                    console.log(linkId);
                    this.$store.dispatch(
                        "conceptMap/deleteLinkFromConceptMap",
                        {
                            linkId: linkId,
                        }
                    );
                });
            }
        },
        // changes the color of the link when user click to it.
        // Can be removed....
        changeColor(event, link) {
            link = Object.assign(link, {
                _color: "orange",
            });
            this.$set(this.links, link.index, link);
        },
    },
};
</script>
<style scoped >
.radioButtons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
.radioButtons * {
    margin-left: 0.5rem;
}

.modal-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.modal-title {
    border-bottom: 1px solid grey;
}
.modal-body {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.modal-body p {
    display: flex;
    justify-content: space-between;
}
.modal-body select {
    margin-bottom: 1rem;
}
.modal-body label {
    margin-bottom: 0.5rem;
}
.modal-buttons {
    display: flex;
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
}
.modal-buttons div button:first-child {
    margin-right: 0.5rem;
}
.buttonGroup {
    padding: 1rem;
    display: flex;
    float: right;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
}
.buttonGroup div {
    display: flex;
    justify-content: flex-start;
}
.buttonGroup div label {
    width: 50%;
}
.link-label {
    fill: purple;
    transform: translate(0, 0.5em);
    font-size: 0.8em;
}
.net {
    width: 100%;
    height: 70vh;
}
</style>
