<template>
    <div class="conceptMapPage">
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
                            v-for="(concept, i) in filteredConcepts"
                            :key="i"
                            :value="concept"
                            :disabled="isInputFull"
                        >
                            {{ concept.name }}
                        </option>
                    </select>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="relationType"
                            id="bidirectional"
                            value="m-start"
                            v-model="relationType"
                            checked
                        />
                        <label class="form-check-label" for="bidirectional">
                            Bidirectional
                        </label>
                    </div>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="relationType"
                            id="unidirectional"
                            value="null"
                            v-model="relationType"
                        />
                        <label class="form-check-label" for="unidirectional">
                            Unidirectional
                        </label>
                    </div>
                    <label for="linkNameInput">Link Name: </label>
                    <b-input id="linkNameInput" v-model="linkName"> </b-input>
                    <div class="modal-buttons">
                        <b-button
                            @click="deleteNode(clickedNode)"
                            variant="danger"
                            size="sm"
                        >
                            <!-- <b-icon icon="trash" size="sm"></b-icon> -->
                            Delete <strong> {{ clickedNode.name }} !</strong>
                        </b-button>

                        <b-button
                            variant="primary"
                            :disabled="isOptionOrInputFull"
                            size="sm"
                            @click="
                                addConceptToConceptMap(
                                    clickedNode,
                                    targetConcept,
                                    linkName,
                                    relationType
                                )
                            "
                        >
                            <!-- <b-icon icon="plus-circle" size="sm"></b-icon> -->
                            Hinzufügen
                            <strong>{{ targetConcept.name }} </strong>
                        </b-button>
                        <b-button
                            @click="hideModal('add-parent-modal')"
                            variant="danger"
                            size="sm"
                            >Close Me
                        </b-button>
                    </div>
                </div>
            </div>
        </b-modal>

        <ConceptMapBar />
        <div v-if="finishedLoading && isEmpty" class="emptyMap">
            <b-card
                bg-variant="info"
                text-variant="white"
                header=""
                class="text-center"
                @click="showAnyModal('add-first-concept-modal')"
            >
                <b-card-text
                    >No concept in map. Click here to add first
                    one..</b-card-text
                >
            </b-card>
        </div>

        <div>
            <b-modal
                centered
                id="add-first-concept-modal"
                title="Add Your First Concept"
                hide-footer
            >
                <b-form-group v-for="(concept, i) in filteredConcepts" :key="i">
                    <b-form-radio
                        v-model="selectedNode"
                        name="some-radios"
                        :value="concept"
                    >
                        {{ concept.name }}
                    </b-form-radio>
                </b-form-group>

                <div class="modal-buttons">
                    <b-button
                        variant="primary"
                        size="sm"
                        :disabled="isSelectedNodeEmpty"
                        @click="addSingleConceptToMap(selectedNode)"
                    >
                        <!-- <b-icon icon="plus-circle" size="sm"></b-icon> -->
                        Hinzufügen
                    </b-button>
                    <b-button
                        @click="hideModal('add-first-concept-modal')"
                        variant="danger"
                        size="sm"
                        >Close Me
                    </b-button>
                </div>
            </b-modal>
        </div>

        <d3-network
            v-if="finishedLoading"
            :net-nodes="activeConceptMap.nodes"
            :net-links="activeConceptMap.links"
            :options="options"
            @node-click="showModal"
            @link-click="changeColor"
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
                        <!-- refX="9"
                    refY="3" -->
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
                        <!-- refX="-4"
                    refY="3" -->
                        <!-- 0 0, 10 3.5, 0 7 -->
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
import ConceptMapBar from "@/components/ConceptMapBar.vue";

import { mapGetters } from "vuex";

export default {
    data() {
        return {
            clickedNode: {}, // the node that user clicked on the concept map
            targetConcept: "", // The concept that we are going to add to the map
            newConceptToAdd: "", // New concept to add map and concept list
            highlightNodes: [],
            linkName: "",
            relationType: "",
            isDataLoaded: false,
            selectedNode: "",
        };
    },
    components: {
        D3Network,
        ConceptMapBar,
    },
    computed: {
        ...mapGetters({
            links: "conceptMap/getLinks",
            nodes: "conceptMap/getNodes",
            deleteMode: "getDeleteMode",
            concepts: "getConcepts",
            conceptMaps: "conceptMap/getConceptMaps",
            index: "conceptMap/getIndex",
            activeConceptMap: "conceptMap/getActiveConceptMap",
            filteredConcepts: "getFilteredConcepts",
            finishedLoading: "conceptMap/getFinishedLoading",
            isEmpty: "conceptMap/getIsConceptMapEmpty",
        }),

        /**
         * It controls if option or input is full or not.
         * We need this info in order to prevent sending an unfilled form
         */
        isOptionOrInputFull() {
            if ((this.newConceptToAdd == "") & (this.relationType == "")) {
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

        conceptNameEmpty() {
            if (this.newConceptMapName !== "") return true;
            return false;
        },

        /**
         * options of concept map.
         * For more information: https://www.npmjs.com/package/vue-d3-network
         * Or just google "vue-d3-network"
         */
        options() {
            return {
                nodeLabels: true,
                nodeSize: 30,
                linkWidth: 3,
                force: 20000,
                fontSize: 15,
                strLinks: true,
                linkLabels: true,

                // size: { h: 700 },
            };
        },

        isSelectedNodeEmpty() {
            console.log(this.selectedNode);
            if (this.selectedNode !== "") return false;
            return true;
        },
    },
    methods: {
        lcb(link) {
            link._svgAttrs = {
                "marker-end": `url(#m-end)`,
                "marker-start": `url(#${link.marker})`,
            };
            return link;
        },

        showAnyModal(modalId) {
            this.$root.$emit("bv::show::modal", modalId);
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
                this.deleteNode(node);
            } else {
                this.$root.$emit("bv::show::modal", "add-parent-modal");
                this.clickedNode = node;
            }
        },

        /**
         * Hide Modal.
         * Hides modal when this methode is called.
         */
        hideModal(modalId) {
            this.$root.$emit("bv::hide::modal", modalId);
            this.clearOptions();
        },
        /**Clear Options.
         * Deletes the value of the option in the modal.
         * targetConcept stores tha values of the option in the modal
         */
        clearOptions() {
            this.targetConcept = "";
            this.linkName = "";
            this.relationType = "";
        },

        addSingleConceptToMap(concept) {
            this.$store.dispatch("conceptMap/addConceptToConceptMap", {
                concept: concept,
            });
        },
        /**
         * Adds given concept to concept map.
         * It controls if the given concepts are in the concept map already.
         * If so it does not save the link.
         * In action "addConceptToConceptMap" we are checking if the given concepts are already in the concept map.
         * Then we return a value.
         * @param sourceConcept The source concept as an object
         * @param targetConcept The target concept as an object
         *
         */
        async addConceptToConceptMap(
            sourceConcept,
            targetConcept,
            linkName,
            relationType
        ) {
            let relationship = [];
            let name = "";
            linkName.length > 0
                ? (name = linkName)
                : (name =
                      "von " +
                      sourceConcept.name +
                      " zu " +
                      targetConcept.name);
            // We need to add the ids of the source and target concept to relationship array.
            relationship.push({
                name: name,
                tid: targetConcept.id,
                sid: sourceConcept.id,
                marker: relationType,
            });
            let isConceptInMap = false;
            // We need to send the source concept as an object to this methode
            isConceptInMap = await this.$store.dispatch(
                "conceptMap/addConceptToConceptMap",
                {
                    concept: sourceConcept,
                }
            );
            // we need to send target concept as an object to this methode
            isConceptInMap = await this.$store.dispatch(
                "conceptMap/addConceptToConceptMap",
                {
                    concept: targetConcept,
                }
            );
            if (!isConceptInMap) {
                // We need to send the relationship as an array
                this.$store.dispatch("conceptMap/addRelationshipToDatabase", {
                    relationship: relationship,
                });
            }
        },

        /**
         * Deletes Node from concept map.
         * It needs to find the related links with the node and delete them too.
         * To find the link we have findLinksOfNode function.
         * To delete links we have deleteLinkFromConceptMap function.
         * To Delete Node we have deleteConceptFromConceptMap funciton
         */
        async deleteNode(node) {
            let linksToDelete = await this.findLinksOfNode(node);

            linksToDelete.forEach((linkId) => {
                this.deleteLinkFromConceptMap(linkId);
            });
            this.deleteConceptFromConceptMap(node);

            for (const linkId of linksToDelete) {
                await this.$store.dispatch(
                    "conceptMap/deleteLinkFromConceptMapTable",
                    linkId
                );
            }

            for (const linkId of linksToDelete) {
                await this.$store.dispatch(
                    "conceptMap/deleteLinkFromRelationsTable",
                    linkId
                );
            }
        },

        /**
         * Remove Concept From Concept Map.
         * @param node The node that we are going to delete from concept map.
         * This method both deletes the concept and the link that are associated with
         * this node.
         */
        deleteConceptFromConceptMap(node) {
            // Removes the node that is send to the methode
            this.$store.dispatch("conceptMap/deleteNodeFromConceptMap", {
                node: node,
            });
        },
        /**
         * Deletes given link from concept map
         */
        deleteLinkFromConceptMap(linkId) {
            this.$store.dispatch("conceptMap/deleteLinkFromConceptMap", {
                linkId: linkId,
            });
        },
        /**
         * Finds Links of the given node in active concept map.
         */
        findLinksOfNode(node) {
            let links = this.activeConceptMap.links;
            let linksOfNode = [];
            console.log(links);
            links.forEach((link) => {
                link.sid == node.id || link.tid == node.id
                    ? linksOfNode.push(link.id)
                    : "";
            });
            console.log(linksOfNode);
            return linksOfNode;
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
    async created() {
        await this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
    },
};
</script>
<style scoped >
.emptyMap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.emptyMap .card {
    border: 1px solid red;
    padding: 4rem;
    font-size: 2rem;
}
.emptyMap .card:hover {
    cursor: pointer;
}

.markers {
    height: 5px;
}
button {
    display: flex !important;
    justify-content: center !important;
    align-items: center;
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
    justify-content: flex-end;
}
.modal-buttons * {
    margin-left: 0.5rem;
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

#m-end path,
#m-start {
    fill: rgba(18, 120, 98, 0.8);
}

.link-label {
    fill: black !important;
    text-shadow: 2px 2px 2px white;
    transform: translate(0, 0.5em) !important;
    font-size: 0.8 em !important;
}
</style>

<style>
/* .link-label {
    fill: black !important;
    text-shadow: 2px 2px 2px white;
    transform: translate(0, 0.5em) !important;
    font-size: 0.8 em !important;
} */
</style>
