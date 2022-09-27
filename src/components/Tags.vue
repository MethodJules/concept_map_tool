<template>
  <div class="tags">
    <h5>Tags</h5>
    <div class="tags-input">
      <span>
        <input type="text" @keydown.enter="addTag(newTag)" v-model="newTag" />
      </span>
      <b-button size="sm" variant="primary" @click="addTag(newTag)">
        <b-icon icon="plus-circle" sm aria-hidden="true"></b-icon>
      </b-button>
    </div>
    <div class="tags-items">
      <span class="tag" v-for="(tag, i) in conceptMap.tags" :key="i">
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
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      newTag: "",
    };
  },
  computed: {
    ...mapState("conceptMap", ["conceptMap"]),
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
      let tags = this.conceptMap.tags;
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
        let tags = this.conceptMap.tags;
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
      let tags = this.conceptMap.tags;
      let index = tags.indexOf(tag);
      tags.splice(index, 1);
      this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
    },
    /**
     * Deletes last tag.
     */
    deleteLastTag() {
      let tags = this.conceptMap.tags;
      if (this.newTag.length <= 0) {
        tags.splice(-1, 1);
        this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
      }
    },
  },
};
</script>
<style scoped>
.tags {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.tags-input {
  margin-bottom: 0.5rem;
}
.tags-input span {
  margin-right: 1rem;
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