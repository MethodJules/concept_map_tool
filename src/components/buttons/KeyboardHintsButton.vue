<template>
  <b-button id="popover-hints">
    <b-icon
      icon="question-circle
"
    ></b-icon>
    <b-popover
      :show.sync="show"
      target="popover-hints"
      triggers="click"
      placement="bottom"
    >
      <h5>Tastatürkürzel</h5>
      <div>
        (auf Node)<strong> alt + click:</strong> <span>Node Löschen </span>
      </div>
      <div>
        (auf Link)<strong> alt + click:</strong> <span>Link Löschen</span>
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