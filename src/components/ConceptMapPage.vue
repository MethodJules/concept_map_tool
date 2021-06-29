<template>
  <b-row class="p-2 m-0">
    <b-col md="2" class="buttonCol">
      <div class="tools">
        <b-form-input
          class="conceptName"
          placeholder="Schreiben Sie hier Concept Name..."
          v-model="conceptName"
        >
        </b-form-input>
        <b-button
          class="d-flex justify-content-between addNewConcept"
          @click="addNewConcept(conceptName)"
          variant="outline-dark"
          :disabled="saveEnabled"
        >
          <span>
            <b> {{ conceptName }} </b>
          </span>
          <span>
            Hinzufügen
            <b-icon md="2" class="align-self-end" icon="plus-circle"></b-icon>
          </span>
        </b-button>

        <b-button variant="warning" class="recommender">
          Recommender
          <b-icon icon="person-lines-fill"></b-icon>
        </b-button>
      </div>
      <span class="hint">
        <i> Double click to change the name of a concept </i>
      </span>
      <div class="buttonGroup" v-for="(concept, i) in concepts" :key="i">
        <b-button
          class="deleteButton"
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

          <div :id="createIdForInput(concept)" class="inputGroup hide">
            <b-form-input size="sm" type="text" v-model="neuConceptName">
            </b-form-input>
            <div class="d-flex flex-column">
              <b-icon @click="closeInput(concept)" icon="x-square"></b-icon>
              <b-icon
                @click="updateConcept(neuConceptName, concept)"
                icon="check-square"
              ></b-icon>
            </div>
          </div>
        </b-row>

        <b-button
          :id="createIdForAddButton(concept)"
          class="addButton"
          size="sm"
          variant="secondary"
        >
          <b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
        </b-button>
        <!-- POPOVER START-->

        <b-popover
          :target="createIdForAddButton(concept)"
          triggers="click"
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
            <!-- User can create a new concept from here too.. -->
            <b-form-group
              label="New Concept"
              label-for="popover-input-1"
              label-cols="6"
              :state="input1state"
              class="mb-1"
              description="Create new concept map"
              invalid-feedback="This field is required"
            >
              <b-form-input
                ref="input1"
                id="popover-input-1"
                v-model="input1"
                :state="input1state"
                size="sm"
              ></b-form-input>
            </b-form-group>
            <!-- User choose the concept to create link with -->
            <b-form-group
              label="Concept"
              label-for="popover-input-2"
              label-cols="6"
              :state="input2state"
              class="mb-1"
              description="Concept to link with"
              invalid-feedback="This field is required"
            >
              <select id="popover-input-2" v-model="targetConcept">
                <option value="" disabled selected hidden>
                  Choose Concept...
                </option>

                <option
                  v-for="(concept, i) in concepts"
                  :key="i"
                  :value="concept.name"
                >
                  {{ concept.name }}
                </option>
              </select>
            </b-form-group>

            <b-alert show class="small">
              <strong>New Label</strong><br />
              Source: <strong>{{ concept.name }}</strong
              ><br />
              Target: <strong>{{ targetConcept }}</strong>
            </b-alert>
            <div class="buttonGroupPopover">
              <b-button
                @click="closePopover(concept)"
                size="sm"
                variant="danger"
                >Cancel</b-button
              >
              <b-button
                @click="addConceptToConceptMap(concept, targetConcept)"
                size="sm"
                variant="primary"
                >Ok</b-button
              >
            </div>
          </div>
        </b-popover>
        <!-- POPOVER END-->
      </div>
    </b-col>
    <b-col md="10" class="border mapContainer">
      <ConceptMap />
    </b-col>
  </b-row>
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

import ConceptMap from "@/components/ConceptMap.vue";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      conceptName: "",
      neuConceptName: "",
      buttonClass: "",
      inputClass: "",
      isInputOpen: false,
      // Popover datas, taken from bootstrap vue website
      // https://bootstrap-vue.org/docs/components/popover
      // Advanced <b-popover> usage with reactive content
      input1: "",
      input1state: null,
      targetConcept: "",
      input2state: null,
      options: [{ text: "- Choose 1 -", value: "" }, "Red", "Green", "Blue"],
      input1Return: "",
      input2Return: "",
      popoverShow: false,
      // Popover datas, taken from bootstrap vue website
    };
  },
  components: {
    ConceptMap,
  },

  computed: {
    ...mapGetters({ concepts: "getConcepts" }),

    saveEnabled() {
      let result = true;
      this.conceptName ? (result = false) : (result = true);
      return result;
    },
    selectOptions() {
      // let options = [];
      let names = [];
      this.concepts.forEach((concept) => {
        names.push(concept.name);
      });
      console.log("éoptions.....");
      console.log(names);

      return names;
    },
  },
  methods: {
    /**
     * Adding concept name to database.
     */
    addNewConcept(conceptName) {
      this.$store.dispatch("addConceptToDb", conceptName);
      this.$store.dispatch("triggerLoading");

      this.conceptName = null;
    },
    /**
     * Deletes the concept from both state and database
     */
    deleteConcept(concept) {
      this.$store.dispatch("deleteConcept", concept);
    },

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
     */
    addConceptToConceptMap(sourceConcept, targetConcept) {
      let targetId;
      let sourceId;
      let target;
      let relationship = [];

      this.concepts.forEach((concept) => {
        if (concept.name == targetConcept) {
          // we are gonna sent it to relations/links
          targetId = concept.id;
          // we are gonna send it to the nodes
          target = concept;
        }
      });
      sourceId = sourceConcept.id;
      relationship.push({ tid: targetId, sid: sourceId });

      this.$store.dispatch("conceptMap/addConceptToConceptMap", sourceConcept);
      this.$store.dispatch("conceptMap/addConceptToConceptMap", target);

      this.$store.dispatch(
        "conceptMap/addRelationshipToConceptMap",
        relationship
      );
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

    // Input Button show hide methodes

    openInput(concept, e) {
      if (!this.isInputOpen) {
        toggleButtonInput(concept, e);
        this.isInputOpen = !this.isInputOpen;
      }
    },

    closeInput(concept) {
      toggleButtonInput(concept);
      this.neuConceptName = "";
      this.isInputOpen = !this.isInputOpen;
    },
    createIdForButton(concept) {
      let id = "button_" + concept.nid;
      return id;
    },
    createIdForAddButton(concept) {
      let id = "button_add_" + concept.nid;
      return id;
    },
    // createIdForPopover(concept) {
    //   let id = "popover_" + concept.nid;
    //   return id;
    // },
    createIdForInput(concept) {
      let id = "input_" + concept.nid;
      return id;
    },
  },
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

.buttonCol {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 90vh;
}
.mapContainer {
  height: 90vh;
}

.tools {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 1rem;
  height: 10rem;
}

.tools .conceptName,
.recommender {
  width: 100%;
  text-align: center;
}
.tools .addNewConcept {
  color: #8795b0 !important;
  border: 1px solid #8795b0;
}
.tools .addNewConcept:hover {
  background-color: #6b79b2;
  color: white !important;
}

.buttonGroup {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 0.5rem;
}
.deleteButton,
.addButton {
  width: 15%;
}
.addButton {
  background-color: #8795b0;
}
.addButton:hover {
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

.inputGroup {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0;
  margin: 0;
  transition: 1s ease;
}
.inputGroup input {
  width: 100%;
}
.hide {
  display: none !important;
}

.hint {
  font-size: 0.8rem;
  text-align: center;
  color: rgb(197, 163, 163);
  margin-bottom: 0.5rem;
}
</style>
