<template>
  <b-row>
    <b-col md="2" class="buttonCol">
      <div class="tools">
        <div class="addConcept">
          <b-form-input placeholder="Concept Name"> </b-form-input>
          <b-button @click="addNewConcept(concept)" variant="outline-primary">
            Add Neu Concept
          </b-button>
        </div>
        <b-button variant="outline-primary">Recommender</b-button>
      </div>
      <div class="buttonGroup" v-for="(concept, i) in concepts" :key="i">
        <b-button class="deleteButton" size="sm" variant="danger">
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-button>

        <b-button class="concept" size="sm" variant="primary">
          {{ concept.name }}
        </b-button>

        <b-button class="addButton" size="sm" variant="success">
          <b-icon icon="arrow-right" aria-hidden="true"></b-icon>
        </b-button>
      </div>
    </b-col>
    <b-col md="10" class="border">MAP</b-col>
  </b-row>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ concepts: "getConcepts" }),
  },
};
</script>
<style scoped>
.tools {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 1rem;
}
.buttonCol {
  display: flex;
  justify-content: center;
  flex-direction: column;
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
