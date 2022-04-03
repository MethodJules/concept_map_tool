<template>
  <div>
    <b-dropdown
      id="dropdown-1"
      :text="conceptMap.title"
      variant="secondary"
      block
      right
      ref="conceptMapDropdown"
    >
      <div class="dropdown-input">
        <b-form-input
          size="sm"
          placeholder="Neue Concept Map"
          v-model="newConceptMapName"
          @keydown.enter="createConceptMap(newConceptMapName)"
        >
        </b-form-input>
        <b-button
          size="sm"
          variant="primary"
          @click="createConceptMap(newConceptMapName)"
          :disabled="!conceptNameEmpty"
        >
          <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
        </b-button>

        <b-button
          size="sm"
          variant="primary"
          @click="toggleConceptMapEditModal()"
        >
          <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
        </b-button>
      </div>
      <!-- <b-modal
        ref="conceptMapEdit-modal"
        class="conceptMapBar-editModal"
        hide-footer
        hide-header
      >
        <div class="conceptMapBar-editModal-container">
          <div class="conceptMapBar-editModal-header">
            <h3>Concept Map-Namen ändern</h3>
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
                @keydown.enter="changeConceptMapName(conceptMap, index)"
              ></b-form-input>
              <b-input-group-append class="d-flex">
                <b-button
                  variant="outline-primary"
                  size="md"
                  @click="changeConceptMapName(conceptMap, index)"
                >
                  <b-icon icon="arrow-repeat" size="md"> </b-icon>
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
              >Schließen</b-button
            >
          </div>
        </div>
      </b-modal> -->
      <b-dropdown-item
        class="dropdown-conceptMap"
        v-for="(conceptMap, i) in concept_maps"
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
          <b-icon icon="trash" size="sm" font-scale="1"></b-icon>
        </b-button>
      </b-dropdown-item>
    </b-dropdown>
    <b-modal
      ref="conceptMapEdit-modal"
      class="conceptMapBar-editModal"
      hide-footer
      hide-header
    >
      <div class="conceptMapBar-editModal-container">
        <div class="conceptMapBar-editModal-header">
          <h3>Concept Map-Namen ändern</h3>
        </div>
        <div class="conceptMapBar-editModal-content">
          <b-input-group
            class="mt-3"
            size="sm"
            v-for="(conceptMap, index) in concept_maps"
            :key="index"
          >
            <b-form-input
              size="sm"
              :placeholder="conceptMap.title"
              v-model="newName[index]"
              @keydown.enter="changeConceptMapName(conceptMap, index)"
            ></b-form-input>
            <b-input-group-append class="d-flex">
              <b-button
                variant="outline-primary"
                size="md"
                @click="changeConceptMapName(conceptMap, index)"
              >
                <b-icon icon="arrow-repeat" size="md"> </b-icon>
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
            >Schließen</b-button
          >
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      newConceptMapName: "",
      newName: "",
    };
  },
  computed: {
    ...mapState("conceptMap", ["concept_maps", "conceptMap"]),

    conceptNameEmpty() {
      if (this.newConceptMapName !== "") return true;
      return false;
    },
  },
  methods: {
    /**
     * Changes the name of the concept map.
     * @param {object} conceptMap, the concept map that its name is going to be changed.
     * @param {integer} index, the index value of the concept map. It is the same with the index of inputs on the modal.
     */
    changeConceptMapName(conceptMap, index) {
      let payload = {
        conceptMap: conceptMap,
        index: index,
        newName: this.newName[index],
      };
      this.$store.dispatch("conceptMapBar/changeConceptMapName", payload);
      this.newName = "";
    },
    /**
     * Opens and closes the concept map edit modal.
     */
    toggleConceptMapEditModal() {
      this.$refs["conceptMapEdit-modal"].toggle();
      this.newName = [];
    },
    /**
     * Deletes the concept map.
     * @param {object} conceptMap, concept map that is going to be deleted
     * @param {integer} index, index of the concept map
     */
    async deleteConceptMap(conceptMap, index) {
      let payload = {
        conceptMap: conceptMap,
        index: index,
      };
      await this.$store.dispatch(
        "conceptMapBar/deleteConceptMapFromUser",
        payload
      );

      await this.$store.dispatch(
        "conceptMapBar/deleteConceptMapFromDatabase",
        conceptMap
      );

      let links = conceptMap.links;
      let nodes = conceptMap.nodes;

      links.forEach((link) => {
        this.$store.dispatch(
          "conceptMap/deleteLinkFromRelationsTable",
          link.id
        );
      });
      nodes.forEach((node) => {
        this.$store.dispatch("deleteConcept", node);
      });
    },

    /**
     * Arranges the concept map that users see both on the dropdown and the page.
     * @param {object} conceptMap, concept map that is going to be shown
     * @param {integer} index, index of the concept map
     */
    conceptMapSelect(conceptMap, index) {
      console.log(conceptMap);

      this.$store.dispatch("conceptMap/fetchConceptMap", conceptMap.id);
      this.$store.state.conceptMap.index = index;
      // this.$store.state.conceptMap.activeConceptMap = conceptMap;
    },

    /**
     * Creates new concept map.
     * @param {string} newConceptMapName, the name of the new concept map.
     */
    createConceptMap(newConceptMapName) {
      let newConceptMap = {
        title: newConceptMapName,
        nodes: [],
        links: [],
        tags: [],
      };
      this.$store.dispatch("conceptMapBar/createConceptMap", newConceptMap);
      this.$refs.conceptMapDropdown.hide(true);
      this.newConceptMapName = "";
    },
  },
};
</script>
<style scoped>
button {
  display: flex !important;
  justify-content: center !important;
  align-items: center;
}

.conceptMapBar-buttons label {
  height: 2rem;
}

.dropdown-input {
  display: flex;
  min-width: 17rem;
  padding: 0.5rem;
}
.dropdown-input button {
  margin: 0 0.5rem;
}
::v-deep .dropdown-item {
  display: flex;
  justify-content: space-between;
}
::v-deep .dropdown-item span {
  width: 100%;
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
.conceptMapBar #dropdown-1 {
  min-width: 7rem;
  padding: 0;
}
</style>