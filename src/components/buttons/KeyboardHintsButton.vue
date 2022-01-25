<template>
  <b-button id="popover-hints">
    <b-icon
      icon="question-circle
"
    ></b-icon>
    <b-popover
      :show.sync="show"
      target="popover-hints"
      triggers="hover"
      placement="bottom"
    >
      <h5>Tastenkürzel</h5>
      <div>
        (auf Knoten)<strong> ALT + Klick:</strong> <span>Knoten löschen </span>
      </div>
      <div>
        (auf Relation)<strong> ALT + Klick:</strong> <span>Relation löschen</span>
      </div>
    </b-popover>
  </b-button>
</template>
<script>
export default {
  methods: {},
};
</script>

<style scoped>
</style>