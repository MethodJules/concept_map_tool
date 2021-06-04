<template>
  <b-row>
    <b-col md="2" class="buttonCol">
      <div class="tools">
        <b-form-input placeholder="Concept Name" v-model="conceptName">
        </b-form-input>
        <b-button
          class="d-flex justify-content-between"
          @click="addNewConcept(conceptName)"
          variant="outline-primary"
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
      <div class="buttonGroup" v-for="(concept, i) in concepts" :key="i">
        <b-button
          class="deleteButton"
          size="sm"
          variant="danger"
          @click="deleteConcept(concept)"
        >
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-button>

        <b-button class="concept" size="sm" variant="primary">
          {{ concept.name }}
        </b-button>

        <b-button class="addButton" size="sm" variant="success">
          <b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
        </b-button>
      </div>
    </b-col>
    <b-col md="10" class="border">MAP</b-col>
  </b-row>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      conceptName: "",
    };
  },
  computed: {
    ...mapGetters({ concepts: "getConcepts" }),
  },
  methods: {
    /**
     * Adding concept name to database.
     */
    addNewConcept(conceptName) {
      this.$store.dispatch("addConceptToDb", conceptName);
    },
    /**
     * Deletes the concept from both state and database
     */
    deleteConcept(concept) {
      this.$store.dispatch("deleteConcept", concept);
    },
  },
};
</script>
<style scoped>
.buttonCol {
  display: flex;
  justify-content: center;
  flex-direction: column;
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
.concept {
  width: 65%;
}
</style>
