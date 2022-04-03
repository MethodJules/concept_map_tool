<template>
  <div>
    <div class="tools">
      <b-form-input
        class="tools-newConceptName"
        size="sm"
        placeholder="Neues Konzept..."
        v-model="conceptName"
        @keydown.enter="addNewConcept(conceptName)"
      >
      </b-form-input>
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
        <b-button class="concept-button" size="sm" variant="primary">
          {{ conceptName }}
        </b-button>
      </b-row>
      <b-button
        class="tools-conceptAdding-add"
        size="sm"
        variant="primary"
        @click="addNewConcept(conceptName)"
      >
        <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
      </b-button>
    </div>

    <div
      class="tools-conceptButtons"
      v-for="(concept, i) in filteredConcepts"
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
          >Doppelt klicken, um den Konzept-Namen zu ändern</b-tooltip
        >

        <div :id="createIdForInput(concept)" class="concept-inputGroup hide">
          <b-form-input
            size="sm"
            type="text"
            v-model="neuConceptName"
            @keydown.enter="updateConcept(neuConceptName, concept)"
            @keydown.esc="closeInput(concept)"
          >
          </b-form-input>
          <div class="concept-inputGroups-buttons">
            <b-icon @click="closeInput(concept)" icon="x-square"></b-icon>
            <b-icon
              @click="updateConcept(neuConceptName, concept)"
              icon="check-square"
            ></b-icon>
          </div>
        </div>
      </b-row>
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
    e.target.classList.add("hide");
    myInput.classList.remove("hide");
  } else {
    myInput.classList.add("hide");
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
      relationType: "",
      linkName: "",
    };
  },
  computed: {
    ...mapGetters({
      concepts: "getConcepts",
      filteredConcepts: "getFilteredConcepts",
    }),

    isWriting() {
      let result = false;
      this.conceptName.length > 0 ? (result = true) : "";
      return result;
    },
  },
  methods: {
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
     * @param {string} conceptName teh name of the new concept that we are going to add
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
      let data = this.isConceptInMap(concept);
      if (data.inMap) {
        alert(
          `Dieses Konzept befindet sich noch auf der Concept Map ${data.consistingMapName}. Bitte lösche es zuerst dort, bevor du es aus der Merkliste löscht.`
        );
      } else {
        this.$store.dispatch("deleteConcept", concept);
      }
    },
    /**
     * Controls if the given concept is in concept map.
     * @param {object} concept concept to control
     * @returns {object} payload, stores if the given concept in some of concept maps,
     * if so the names of concept map is also stored.
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
      let payload = {
        inMap: inMap,
        consistingMapName: consistingMapName,
      };
      return payload;
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
     * We need to create some unique id for inputs to
     * make some unique works on them.
     */
    createIdForInput(concept) {
      let id = "input_" + concept.nid;
      return id;
    },
  },

  mounted: function () {
    // with this.$nextTick it waits all child components to load. Then it works.
    // We need concept maps to load. Thats why we made it so.
    this.$nextTick(function () {
      this.$store.dispatch("loadConceptListFromDb");
    });
    // this.$store.dispatch("loadConceptListFromDb");
  },
};
</script>

<style scoped>
/* Tools */
.tools {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
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

.concept-button {
  display: flex;
  width: 100%;
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
  width: 80%;
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
