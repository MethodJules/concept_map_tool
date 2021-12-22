<template>
  <div class="conceptMapBar">
    <div class="tags">
      <span class="tag" v-for="(tag, i) in activeConceptMap.tags" :key="i">
        <span class="tag-name">{{ tag }}</span>
        <b-icon
          icon="x-circle"
          scale="1"
          variant="secondary"
          @click="deleteTag(tag)"
        ></b-icon>
      </span>

      <span>
        <input type="text" @keydown.enter="addTag(newTag)" v-model="newTag" />
        <!-- @keydown.backspace="deleteTag(tag)" removed, users will likely delete their tags by accident -->
      </span>
      <b-button size="sm" variant="primary" @click="addTag(newTag)">
        <b-icon icon="plus-circle" sm aria-hidden="true"></b-icon>
      </b-button>
    </div>

    <b-dropdown
      id="dropdown-1"
      :text="activeConceptMap.title"
      variant="secondary"
      block
      size="sm"
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
          <b-icon icon="trash" size="sm" font-scale="1"></b-icon>
        </b-button>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
/**
 * For more information: https://www.npmjs.com/package/vue-d3-network
 * Or just google "vue-d3-network"
 * A good example: https://emiliorizzo.github.io/vue-d3-network/
 *
 */
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      highlightNodes: [],
      newConceptMapName: "",
      newName: [],
      newTag: "",
    };
  },
  computed: {
    ...mapGetters({
      conceptMaps: "conceptMap/getConceptMaps",
      index: "conceptMap/getIndex",
      activeConceptMap: "conceptMap/getActiveConceptMap",
    }),

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
      this.$store.state.conceptMap.index = index;
      this.$store.state.conceptMap.activeConceptMap = conceptMap;
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
    /**
     * Controls if the given tag is exists.
     * @param {string} newTag, the tag name is going to be controlled if it exists
     * @return {object} payload, it consist if tag is valid and a message when there is a problem.
     */
    tagValidation(newTag) {
      let isValid = false;
      let errorMessage = "";
      console.log(this.activeConceptMap);
      let tags = this.activeConceptMap.tags;
      console.log(tags);
      if (newTag.length <= 0) {
        isValid = true;
        errorMessage = "Tag-Name ist leer.";
      }
      if (tags.length > 0) {
        tags.forEach((tag) => {
          if (tag == newTag) {
            isValid = true;
            errorMessage = "Tag-Name wird bereits verwendet.";
          }
        });
      }
      let payload = {
        isValid,
        errorMessage,
      };
      return payload;
    },
    /**
     * Adds new tag.
     * @param {string} newTag, the new tag is going to ne added.
     */
    addTag(newTag) {
      let auth = this.tagValidation(newTag);
      if (!auth.isValid) {
        let tags = this.activeConceptMap.tags;
        tags.push(newTag);
        this.$store.dispatch("conceptMapBar/addTagToConceptMap", tags);
      } else {
        alert(auth.errorMessage);
      }
      this.newTag = "";
    },
    /**
     * Deletes tag.
     * @param {string} tag, the tag that is going to be deleted.
     */
    deleteTag(tag) {
      let tags = this.activeConceptMap.tags;
      let index = tags.indexOf(tag);
      tags.splice(index, 1);
      this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
    },
    /**
     * Deletes last tag.
     */
    deleteLastTag() {
      let tags = this.activeConceptMap.tags;
      if (this.newTag.length <= 0) {
        tags.splice(-1, 1);
        this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
      }
    },
  },
};
</script>

<style scoped >
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

.conceptMapBar {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  width: 100%;
}
.conceptMapBar * {
  margin: 2px;
}
.conceptMapBar #dropdown-1 {
  min-width: 5rem;
  padding: 0;
}
.tags {
  min-width: 30%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.tag {
  padding: 0.4rem;
  font-size: 14px;
  margin-right: 0.3rem;
  margin-top: 0.3rem;
  border-radius: 5px;
  color: #383d41;
  background-color: #e2e3e5;
  border-color: #b8daff;
  cursor: default;
}
.tags svg {
  cursor: pointer;
}
.tags input {
  min-height: 2rem;
  width: 10rem;
  outline: none;
  border-radius: 5px;
  border: 1px solid gray;
}
</style>

