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
                            value="null"
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
                            value="m-start"
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
                            @click="hideModal()"
                            variant="danger"
                            size="sm"
                            >Close Me
                        </b-button>
                    </div>
                </div>
            </div>
        </b-modal>

        <div class="conceptMapBar">
            <div>
                <b-dropdown
                    id="dropdown-1"
                    :text="activeConceptMap.title"
                    variant="primary"
                    size="sm"
                    right
                    ref="conceptMapDropdown"
                >
                    <div class="dropdown-input">
                        <b-form-input
                            size="sm"
                            placeholder="Neu Concept Map"
                            v-model="newConceptMapName"
                            @keydown.enter="createConceptMap(newConceptMapName)"
                        >
                            <!-- @keydown.enter.prevent="!conceptNameEmpty" -->
                            <!-- How to stop enter when There is no name there... -->
                        </b-form-input>
                        <b-button
                            size="sm"
                            variant="success"
                            @click="createConceptMap(newConceptMapName)"
                            :disabled="!conceptNameEmpty"
                        >
                            <b-icon
                                icon="plus-circle"
                                aria-hidden="true"
                            ></b-icon>
                        </b-button>

                        <b-button
                            size="sm"
                            variant="success"
                            @click="toggleConceptMapEditModal()"
                        >
                            <b-icon
                                icon="pencil-square"
                                aria-hidden="true"
                            ></b-icon>
                        </b-button>
                    </div>
                    <b-modal
                        ref="conceptMapEdit-modal"
                        class="conceptMapBar-editModal"
                        hide-footer
                        hide-header
                    >
                        <div class="conceptMapBar-editModal-container">
                            <div class="conceptMapBar-editModal-header">
                                <h3>Concept Map Edit</h3>
                            </div>
                            <div class="conceptMapBar-editModal-content">
                                <b-input-group
                                    class="mt-3"
                                    size="sm"
                                    v-for="(conceptMap, index) in conceptMaps"
                                    :key="index"
                                >
                                    <b-form-input
                                        size="sm"
                                        :placeholder="conceptMap.title"
                                        v-model="newName[index]"
                                        @keydown.enter="
                                            changeConceptMapName(
                                                conceptMap,
                                                index
                                            )
                                        "
                                    ></b-form-input>
                                    <b-input-group-append class="d-flex">
                                        <b-button
                                            variant="outline-primary"
                                            size="md"
                                            @click="
                                                changeConceptMapName(
                                                    conceptMap,
                                                    index
                                                )
                                            "
                                        >
                                            <b-icon
                                                icon="arrow-repeat"
                                                size="md"
                                            >
                                            </b-icon>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>

                            <div class="conceptMapBar-editModal-footer">
                                <b-button
                                    variant="danger"
                                    size="sm"
                                    block
                                    @click="toggleConceptMapEditModal()"
                                    >Close Me</b-button
                                >
                            </div>
                        </div>
                    </b-modal>
                    <b-dropdown-item
                        class="dropdown-conceptMap"
                        v-for="(conceptMap, i) in conceptMaps"
                        :key="i"
                    >
                        <span @click="conceptMapSelect(conceptMap, i)">
                            {{ conceptMap.title }}
                        </span>

                        <b-button
                            class="tools-buttonsDeleteMode"
                            size="sm"
                            variant="danger"
                            @click.stop="deleteConceptMap(conceptMap, i)"
                        >
                            <b-icon
                                icon="trash"
                                size="sm"
                                font-scale="1"
                            ></b-icon>
                        </b-button>
                    </b-dropdown-item>
                </b-dropdown>
            </div>
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
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            // variables for link options:
            nodeSize: 30, // Link Options: arranges the size of nodes
            linkWidth: 3, // Link Options: arranges the size of the link
            force: 20000, // Link Options: arranges how much wide the concept map
            fontSize: 15, // Link Options: arranges the font size of the node
            strLinks: true, // Link Options: decide if the links are straight or curved
            linkLabels: true,
            clickedNode: {}, // the node that user clicked on the concept map
            targetConcept: "", // The concept that we are going to add to the map
            newConceptToAdd: "", // New concept to add map and concept list
            highlightNodes: [],
            newConceptMapName: "",
            newName: [],
            linkName: "",
            relationType: "",
            isDataLoaded: false,
            // symbol: "m-end",
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
            activeConceptMap: "conceptMap/getActiveConceptMap",
            filteredConcepts: "getFilteredConcepts",
            finishedLoading: "conceptMap/getFinishedLoading",
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
                force: this.force,
                nodeSize: this.nodeSize,
                nodeLabels: true,
                linkWidth: this.linkWidth,
                fontSize: this.fontSize,
                strLinks: this.strLinks,
                linkLabels: this.linkLabels,
                // size: { h: 700 },
            };
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

        changeConceptMapName(conceptMap, index) {
            let payload = {
                conceptMap: conceptMap,
                index: index,
                newName: this.newName[index],
            };
            this.$store.dispatch("conceptMap/changeConceptMapName", payload);
            this.newName = "";
        },

        toggleConceptMapEditModal() {
            this.$refs["conceptMapEdit-modal"].toggle();
        },

        async deleteConceptMap(conceptMap, index) {
            let payload = {
                conceptMap: conceptMap,
                index: index,
            };
            await this.$store.dispatch(
                "conceptMap/deleteConceptMapFromUser",
                payload
            );

            await this.$store.dispatch(
                "conceptMap/deleteConceptMapFromDatabase",
                conceptMap
            );

            let links = conceptMap.links;
            console.log(links);

            links.forEach((link) => {
                console.log(link);
                console.log(link.id);
                this.$store.dispatch(
                    "conceptMap/deleteLinkFromRelationsTable",
                    link.id
                );
            });
        },

        conceptMapSelect(conceptMap, index) {
            this.$store.state.conceptMap.index = index;
            this.$store.state.conceptMap.activeConceptMap = conceptMap;
        },

        createConceptMap(newConceptMapName) {
            let newConceptMap = {
                title: newConceptMapName,
                nodes: [],
                links: [],
            };
            this.$store.dispatch("conceptMap/createConceptMap", newConceptMap);
            this.$refs.conceptMapDropdown.hide(true);
            this.newConceptMapName = "";
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
        hideModal() {
            this.$root.$emit("bv::hide::modal", "add-parent-modal");
            this.clearOptions();
        },
        /**Clear Options.
         * Deletes the value of the option in the modal.
         * targetConcept stores tha values of the option in the modal
         */
        clearOptions() {
            this.targetConcept = "";
            this.linkName = "";
        },
        /**
         * Adds given concept to concept map
         * @param sourceConcept The source concept as an object
         * @param targetConcept The target concept as an object
         *
         */
        addConceptToConceptMap(
            sourceConcept,
            targetConcept,
            linkName,
            relationType
        ) {
            console.log(relationType);
            let relationship = [];
            let name = "";
            linkName.length > 0
                ? (name = linkName)
                : (name =
                      "von " +
                      sourceConcept.name +
                      " zu " +
                      targetConcept.name);
            console.log(name);
            // We need to add the ids of the source and target concept to relationship array.
            relationship.push({
                name: name,
                tid: targetConcept.id,
                sid: sourceConcept.id,
                marker: relationType,
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
        // this.$nextTick(function () {
        //     // Code that will run only after the
        //     // entire view has been rendered
        //     this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
        // });
        await this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
    },
};
</script>
<style scoped >
.markers {
    height: 5px;
}
button {
    display: flex;
    justify-content: center;
    align-items: center;
}
.conceptMapBar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
.conceptMapBar * {
    margin-left: 0.5rem;
}
.conceptMapBar-buttons {
    height: 2rem;
}
.conceptMapBar-buttons label {
    height: 2rem;
}
.dropdown {
    min-width: 16rem;
}

.dropdown-input {
    display: flex;
    padding-right: 1rem;
    min-width: 15rem;
}
::v-deep .dropdown-item {
    display: flex;
    justify-content: space-between;
}
::v-deep .dropdown-item span {
    width: 100%;
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

/* Recommender Modal */
.conceptMapBar-editModal-header {
    text-align: center;
}
.conceptMapBar-editModal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}
.conceptMapBar-editModal-container {
    padding: 0.5rem 1rem;
}

.conceptMapBar-editModal-inputPrepend {
    min-width: 5em;
}
.conceptMapBar-editModal-inputPrepend button {
    width: 8em;
}

ul.menu {
    list-style: none;
    position: absolute;
    z-index: 100;
    min-width: 20em;
    text-align: left;
}
ul.menu li {
    margin-top: 1em;
    position: relative;
}

#m-end path,
#m-start {
    fill: rgba(18, 120, 98, 0.8);
}
</style>

<style>
.link-label {
    fill: yellow !important;
    text-shadow: 2px 2px 2px black;
    transform: translate(0, 0.5em) !important;
    font-size: 0.8em !important;
}
</style>
