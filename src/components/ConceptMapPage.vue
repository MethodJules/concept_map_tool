<template>
  <b-row class="p-2 m-0">
    <b-col md="2" class="buttonCol">
      <div class="tools">
        <b-form-input
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

        <b-button variant="warning">
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

        <b-button class="addButton" size="sm" variant="secondary">
          <b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
        </b-button>
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
    createIdForInput(concept) {
      let id = "input_" + concept.nid;
      return id;
    },
  },
};
</script>
<style scoped>
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

.tools input,
button {
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
