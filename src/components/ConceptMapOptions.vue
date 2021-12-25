<template>
  <div class="conceptMapOptions">
    <h5>Concept Map Optionen</h5>
    <label for="force" class="form-label">Force</label>
    <div class="conceptMapOptions-inputBox">
      <input
        type="range"
        class="form-range"
        min="1000"
        max="100000"
        id="force"
        v-model="conceptMapOptions.force"
      />
      <b-icon
        @click="defaultConceptMapValues('force')"
        icon="arrow-counterclockwise"
        font-scale="1.1"
      ></b-icon>
    </div>

    <label for="nodeSize" class="form-label">Node Size</label>
    <div class="conceptMapOptions-inputBox">
      <input
        type="range"
        class="form-range"
        min="10"
        max="100"
        id="nodeSize"
        v-model="conceptMapOptions.nodeSize"
      />
      <b-icon
        @click="defaultConceptMapValues('nodeSize')"
        icon="arrow-counterclockwise"
        font-scale="1.1"
      ></b-icon>
    </div>

    <label for="fontSize" class="form-label">Font Size</label>
    <div class="conceptMapOptions-inputBox">
      <input
        type="range"
        class="form-range"
        min="10"
        max="50"
        id="fontSize"
        v-model="conceptMapOptions.fontSize"
      />
      <b-icon
        @click="defaultConceptMapValues('fontSize')"
        icon="arrow-counterclockwise"
        font-scale="1.1"
      ></b-icon>
    </div>
    <div class="conceptMapOptions-button">
      <b-button
        @click="allConceptMapOptionsDefault()"
        size="sm"
        variant="primary"
        >Alle Zurücksetzen</b-button
      >
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      conceptMapOptions: "conceptMap/getConceptMapOptions",
    }),
  },
  methods: {
    defaultConceptMapValues(attribute) {
      if (attribute == "fontSize") {
        this.conceptMapOptions.fontSize = 15;
      } else if (attribute == "nodeSize") {
        this.conceptMapOptions.nodeSize = 30;
      } else if (attribute == "force") {
        this.conceptMapOptions.force = 30000;
      }
    },

    allConceptMapOptionsDefault() {
      this.conceptMapOptions.fontSize = 15;
      this.conceptMapOptions.nodeSize = 30;
      this.conceptMapOptions.force = 30000;
    },
  },
};
</script>
<style scoped>
.conceptMapOptions label {
  padding: 0;
  margin: 0;
}
.conceptMapOptions-inputBox {
  display: flex;
}
.conceptMapOptions-button {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
}
</style>