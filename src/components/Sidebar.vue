<template>
    <div>
        <div class="tools">
            <div class="tools-buttons">
                <b-button
                    class="tools-buttonsRecommender"
                    size="sm"
                    variant="warning"
                    @click="toggleRecommenderModal"
                >
                    Recommender
                    <b-icon icon="person-lines-fill" font-scale="1"></b-icon>
                </b-button>
                <b-button
                    class="tools-buttonsDeleteMode"
                    size="sm"
                    variant="danger"
                    @click="toggleDeleteMode()"
                >
                    Delete Mode
                    <b-icon
                        v-if="isDeleteModeOn"
                        icon="circle-fill"
                        animation="throb"
                        font-scale="1"
                    ></b-icon>
                </b-button>
            </div>
            <b-form-input
                class="tools-newConceptName"
                size="sm"
                placeholder="Neu Concept Name..."
                v-model="conceptName"
                @keydown.enter="addNewConcept(conceptName)"
            >
            </b-form-input>
            <b-modal
                ref="recommender-modal"
                class="recommender-modal"
                hide-footer
                hide-header
            >
                <div class="recommender-modal-container">
                    <div class="recommender-modal-header">
                        <h3>Recommender</h3>
                    </div>
                    <div class="recommender-modal-content"></div>

                    <p v-for="(concept, i) in concepts" :key="i">
                        {{ concept.name }}
                    </p>
                    <div class="recommender-modal-footer">
                        <b-button
                            variant="danger"
                            size="sm"
                            block
                            @click="toggleRecommenderModal"
                            >Close Me</b-button
                        >
                    </div>
                </div>
            </b-modal>
        </div>
        <div class="tools-conceptAdding" v-if="isWriting">
            <b-button
                class="tools-conceptAdding-cancel"
                size="sm"
                variant="danger"
                @click="conceptName = ''"
            >
                <b-icon icon="x-circle" aria-hidden="true"></b-icon>
            </b-button>
            <b-row class="concept">
                <b-button class="d-flex" size="sm" variant="primary">
                    {{ conceptName }}
                </b-button>
            </b-row>
            <b-button
                class="tools-conceptAdding-add"
                size="sm"
                variant="success"
                @click="addNewConcept(conceptName)"
            >
                <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
            </b-button>
        </div>
        <div
            class="tools-conceptButtons"
            v-for="(concept, i) in concepts"
            :key="i"
        >
            <b-button
                class="tools-conceptButtons-deleteButton"
                size="sm"
                variant="danger"
                @click="deleteConcept(concept)"
            >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
            </b-button>

            <b-row class="concept">
                <b-button
                    class="d-flex"
                    :id="createIdForButton(concept)"
                    size="sm"
                    variant="primary"
                    @dblclick="openInput(concept, $event)"
                >
                    {{ concept.name }}
                </b-button>
                <b-tooltip
                    :target="createIdForButton(concept)"
                    placement="right"
                    variant="secondary"
                    noninteractive
                    >Double click to change the concept name</b-tooltip
                >

                <div
                    :id="createIdForInput(concept)"
                    class="concept-inputGroup hide"
                >
                    <b-form-input
                        size="sm"
                        type="text"
                        v-model="neuConceptName"
                        @keydown.enter="updateConcept(neuConceptName, concept)"
                        @keydown.esc="closeInput(concept)"
                    >
                    </b-form-input>
                    <div class="concept-inputGroups-buttons">
                        <b-icon
                            @click="closeInput(concept)"
                            icon="x-square"
                        ></b-icon>
                        <b-icon
                            @click="updateConcept(neuConceptName, concept)"
                            icon="check-square"
                        ></b-icon>
                    </div>
                </div>
            </b-row>

            <b-button
                :id="createIdForAddButton(concept)"
                class="tools-conceptButtons-addButton"
                size="sm"
                variant="secondary"
            >
                <b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
            </b-button>
            <!-- POPOVER START-->

            <b-popover
                :target="createIdForAddButton(concept)"
                triggers="focus"
                placement="auto"
                container="my-container"
                ref="popover"
                @show="onShow"
            >
                <div class="popoverTitle">
                    <span> <b> Add to concept map </b> </span>
                    <b-button
                        @click="closePopover(concept)"
                        variant="secondary"
                        size="sm"
                        aria-label="Close"
                    >
                        <span>&times;</span>
                    </b-button>
                </div>

                <div>
                    <!-- User choose the concept to create link with -->
                    <div v-if="!isEmpty">
                        <b-form-group
                            label="Concept"
                            label-for="popover-input-2"
                            label-cols="6"
                            :state="input2state"
                            class="mb-1"
                            description="Concept to link with"
                            invalid-feedback="This field is required"
                        >
                            <select
                                id="popover-input-2"
                                v-model="targetConcept"
                            >
                                <option value="" disabled selected hidden>
                                    Choose Concept...
                                </option>

                                <option
                                    v-for="(concept, i) in concepts"
                                    :key="i"
                                    :value="concept"
                                >
                                    {{ concept.name }}
                                </option>
                            </select>
                        </b-form-group>

                        <b-alert show class="small">
                            <strong>New Label</strong><br />
                            Source: <strong>{{ concept.name }}</strong
                            ><br />
                            Target:
                            <strong>{{ targetConcept.name }}</strong>
                        </b-alert>
                    </div>
                    <div v-if="isEmpty">
                        <b-alert show class="small">
                            <strong>There is no concept in map. </strong><br />
                            First concept is:
                            <strong>{{ concept.name }}</strong>
                        </b-alert>
                    </div>

                    <div class="buttonGroupPopover">
                        <b-button
                            @click="closePopover(concept)"
                            size="sm"
                            variant="danger"
                            >Cancel</b-button
                        >
                        <b-button
                            @click="
                                addConceptToConceptMap(concept, targetConcept)
                            "
                            size="sm"
                            variant="primary"
                            >Ok</b-button
                        >
                    </div>
                </div>
            </b-popover>
            <!-- POPOVER END-->
        </div>
    </div>
</template>
<script>
function toggleButtonInput(concept, e) {
    // Select input
    let inputId = "input_" + concept.nid;
    let myInput = document.getElementById(inputId);

    // select button
    let buttonId = "button_" + concept.nid;
    let myButton = document.getElementById(buttonId);

    if (e) {
        // hide button
        e.target.classList.add("hide");
        // show input
        myInput.classList.remove("hide");
    } else {
        // hide input
        myInput.classList.add("hide");
        // show button
        myButton.classList.remove("hide");
    }
}

import { mapGetters } from "vuex";

export default {
    data() {
        return {
            conceptName: "", // Name of the concept, we are using it in the input that we create new concept
            neuConceptName: "", // new name of the concept, we are using it in the input tha tshown when we double click to the concept
            isInputOpen: false,
            isDeleteModeOn: false,
            // Popover datas, taken from bootstrap vue website
            // https://bootstrap-vue.org/docs/components/popover
            // Advanced <b-popover> usage with reactive content

            targetConcept: "",
            input2state: null,
            options: [
                { text: "- Choose 1 -", value: "" },
                "Red",
                "Green",
                "Blue",
            ],
            input2Return: "",
            // Popover datas, taken from bootstrap vue website
        };
    },
    computed: {
        // getter for concepts
        ...mapGetters({
            concepts: "getConcepts",
            isEmpty: "conceptMap/getIsConceptMapEmpty", // if there is no concept in map, we change the popover content
        }),
        /**
         * Methode to enable new concept adding
         * If something is written in the new concept input,
         * then it makes the "hinzufügen" button enabled, vice versa...
         *
         */
        saveEnabled() {
            let result = true;
            this.conceptName ? (result = false) : (result = true);
            return result;
        },
        /**
         * returns the names for the options in popover select box.
         */
        selectOptions() {
            let names = [];
            this.concepts.forEach((concept) => {
                names.push(concept.name);
            });

            return names;
        },
        isWriting() {
            let result = false;
            this.conceptName.length > 0 ? (result = true) : "";
            return result;
        },
    },
    methods: {
        /**
         * Toggle Methode.
         * Opens and closes the recommender modal.
         * It may be better instead writing two methode for opening and closing.
         */
        toggleRecommenderModal() {
            this.$refs["recommender-modal"].toggle();
        },

        /**
         * When we call this method, we can click and delete nodes.
         * It triggers the method changeNodeColor, which changes the color of node.
         */
        toggleDeleteMode() {
            this.$store.dispatch("toggleDeleteMode");
            let color = "";
            if (this.isDeleteModeOn) {
                color = "white";
                this.isDeleteModeOn = !this.isDeleteModeOn;
            } else {
                color = "#E6F927";
                this.isDeleteModeOn = !this.isDeleteModeOn;
            }
            this.changeNodeColor(color);
        },
        /**
         * @param {string} color, the color value that we will assign to node
         * Changes the color of node with given color
         */
        changeNodeColor(color) {
            this.nodes.forEach((node) => {
                node = Object.assign(node, {
                    _color: color,
                });
                this.$set(this.nodes, node.index, node);
            });
        },

        /**
         * Adding concept name to database.
         */
        addNewConcept(conceptName) {
            this.$store.dispatch("addConceptToDb", conceptName);
            this.$store.dispatch("triggerLoading");

            this.conceptName = "";
        },
        /**
         * Deletes the concept from both state and database.
         * @param {object} concept concept to delete
         */
        deleteConcept(concept) {
            alert("Are you sure??");
            let data = this.isConceptInMap(concept);
            if (data.inMap) {
                alert(
                    `Diese Konzept ist in ${data.consistingMapName}, Bitte löschen Sie von der Konzept Map zuerst.`
                );
            } else {
                this.$store.dispatch("deleteConcept", concept);
            }
        },
        /**
         * Controls if the given concept is in concept map.
         * @param {object} concept concept to control
         */
        isConceptInMap(concept) {
            let inMap = false;
            let consistingMapName;
            this.$store.state.conceptMap.concept_maps.forEach((conceptMap) => {
                conceptMap.nodes.forEach((node) => {
                    if (node.id == concept.id) {
                        inMap = true;
                        consistingMapName = conceptMap.title;
                    }
                });
            });
            return { inMap: inMap, consistingMapName: consistingMapName };
        },
        /**
         * Updates the name of the concept.
         * @param neuConceptName new name of the concept
         * @param concept the concept that we want to change its name.
         */
        updateConcept(neuConceptName, concept) {
            let payload = {
                concept,
                neuConceptName,
            };
            this.$store.dispatch("updateConcept", payload);
            this.neuConceptName = "";
            toggleButtonInput(concept);
            this.isInputOpen = !this.isInputOpen;
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

            if (this.isEmpty) {
                this.$store.dispatch("conceptMap/addConceptToConceptMap", {
                    concept: sourceConcept,
                });
            } else {
                relationship.push({
                    name: sourceConcept.name + " -&- " + targetConcept.name,
                    tid: targetConcept.id,
                    sid: sourceConcept.id,
                }); // We need to send the relationship as an array
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
            }
        },

        // START! Methods for popover, taken from bootstrap vue
        // https://bootstrap-vue.org/docs/components/popover
        // Advanced <b-popover> usage with reactive content
        closePopover(concept) {
            let id = this.createIdForAddButton(concept);
            this.$root.$emit("bv::hide::popover", id);
        },
        addLabel(concept) {
            if (this.input2) {
                console.log("Send it to the database. Wuhu...");

                this.closePopover(concept);
                // Return our popover form results
                this.input1Return = this.input1;
                this.input2Return = this.input2;
            }
        },
        onShow() {
            // This is called just before the popover is shown
            // Reset our popover form variables
            this.input1 = "";
            this.input2 = "";
            this.input1state = null;
            this.input2state = null;
            this.input1Return = "";
            this.input2Return = "";
        },

        // END! Methods for popover, taken from bootstrap vue

        /** Opens the input.
         * @concept the concept that we double clicked on it.
         * @e we need to send event to toogle input.
         * Usage: when we double click to a concept.
         */
        openInput(concept, e) {
            if (!this.isInputOpen) {
                toggleButtonInput(concept, e);
                this.isInputOpen = !this.isInputOpen;
            }
        },
        /** Closes the input.
         * @concept the concept that we double clicked on it.
         * @e we need to send event to toogle input.
         */
        closeInput(concept) {
            toggleButtonInput(concept);
            this.neuConceptName = "";
            this.isInputOpen = !this.isInputOpen;
        },

        /**
         * We need to create some unique id for buttons to
         * make some unique works on them.
         */
        createIdForButton(concept) {
            let id = "button_" + concept.nid;
            return id;
        },
        /**
         * We need to create some unique id for buttons to
         * make some unique works on them.
         */
        createIdForAddButton(concept) {
            let id = "button_add_" + concept.nid;
            return id;
        },
        /**
         * We need to create some unique id for inputs to
         * make some unique works on them.
         */
        createIdForInput(concept) {
            let id = "input_" + concept.nid;
            return id;
        },
    },
    // async created() {
    //     await this.$store.dispatch("loadConceptListFromDb");
    // },
};
</script>
<style scoped>
/* Popover style start*/
.popoverTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    margin-bottom: 0;
    font-size: 1rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #d8d8d8;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
}

#popover-input-2 {
    width: 100%;
}
.buttonGroupPopover {
    display: flex;
    justify-content: flex-end;
}
.buttonGroupPopover button {
    margin-left: rem;
}
/* Popover style end*/

/* Tools */
.tools {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin-bottom: 1rem;
}

.tools-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.tools-newConceptName {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-between;
}
.tools-buttonsDeleteMode {
    display: flex;
    justify-content: space-between;
}
.tools-addNewConcept {
    color: #8795b0 !important;
    border: 1px solid #8795b0;
    display: flex;
    justify-content: space-between;
}
.tools-addNewConcept:hover {
    background-color: #6b79b2;
    color: white !important;
}
/* Tools */

/* New Concept Adding Button */
.tools-conceptAdding {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 0.5rem;
}
.tools-conceptAdding-cancel,
.tools-conceptAdding-add {
    width: 15%;
}
/* New Concept Adding Button */
/* Concept Buttons  */
.tools-conceptButtons {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 0.5rem;
}

.tools-conceptButtons-deleteButton,
.tools-conceptButtons-addButton {
    width: 15%;
}
.tools-conceptButtons-addButton {
    background-color: #8795b0;
}
.tools-conceptButtons-addButton:hover {
    background-color: #6b79b2;
}

.concept {
    width: 65%;
    padding: 0;
    margin: 0;
}

.concept button {
    background-color: #8795b0 !important;
    border: none;
}
.concept button:hover {
    background-color: #6b79b2 !important;
}

.concept-inputGroup {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 0;
    margin: 0;
    transition: 1s ease;
}
.concept-inputGroup input {
    width: 100%;
}
.hide {
    display: none !important;
}

.concept-inputGroups-buttons {
    display: flex;
    flex-direction: column;
}

/* Concept Buttons  */

/* Recommender Modal */
.recommender-modal-header {
    text-align: center;
}
.recommender-modal-footer {
    display: flex;
    justify-content: flex-end;
}
.recommender-modal-container {
    padding: 0.5rem 1rem;
}
</style>
