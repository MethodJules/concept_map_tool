<template>
  <div>
    <b-button v-b-toggle.sidebar id="sidebarButton">
      <b-icon icon="layout-sidebar-inset-reverse" font-scale="1"></b-icon>
    </b-button>
    <b-tooltip
      target="sidebarButton"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Sidebar</b-tooltip
    >
    <b-sidebar
      id="sidebar"
      aria-label="Sidebar with custom footer"
      shadow
      right
      title="Sidebar"
    >
      <div class="tags">
        <div class="tags-input">
          <span>
            <input
              type="text"
              @keydown.enter="addTag(newTag)"
              v-model="newTag"
            />
          </span>
          <b-button size="sm" variant="primary" @click="addTag(newTag)">
            <b-icon icon="plus-circle" sm aria-hidden="true"></b-icon>
          </b-button>
        </div>
        <div class="tags-items">
          <span class="tag" v-for="(tag, i) in activeConceptMap.tags" :key="i">
            <span class="tag-name">{{ tag }}</span>
            <b-icon
              icon="x-circle"
              scale="1"
              variant="secondary"
              @click="deleteTag(tag)"
            ></b-icon>
          </span>
        </div>
      </div>
      <template #footer="{ hide }">
        <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
          <strong class="mr-auto">Footer</strong>
          <b-button size="sm" @click="hide">Close</b-button>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      newTag: "",
    };
  },
  computed: {
    ...mapGetters({
      conceptMaps: "conceptMap/getConceptMaps",
      index: "conceptMap/getIndex",
      activeConceptMap: "conceptMap/getActiveConceptMap",
    }),
  },
  methods: {
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
<style scoped>
#sidebar {
  padding: 1rem;
}
::v-deep .b-sidebar-body {
  padding: 0 0.5rem !important;
}

.tags {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.tags-input {
  margin-bottom: 0.5rem;
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