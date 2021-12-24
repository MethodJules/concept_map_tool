<template>
  <b-modal
    ref="recommender-modal"
    class="recommender-modal"
    hide-footer
    hide-header
  >
    <div class="recommender-modal-container">
      <div class="recommender-modal-header">
        <h3>Recommender</h3>
      </div>
      <div class="recommender-modal-content"></div>

      <p v-for="(concept, i) in filteredConcepts" :key="i">
        {{ concept.name }}
      </p>
      <div class="recommender-modal-footer">
        <b-button
          variant="danger"
          size="sm"
          block
          @click="toggleRecommenderModal"
          >Schließen</b-button
        >
      </div>
    </div>
  </b-modal>
</template>
<script>
export default {};
</script>
<style scoped>
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