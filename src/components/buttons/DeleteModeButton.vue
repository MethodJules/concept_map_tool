<template>
  <b-button
    class="tools-buttonsDeleteMode"
    size="sm"
    variant="secondary"
    id="deleteButton"
    @click="toggleDeleteMode()"
  >
    <b-tooltip
      target="deleteButton"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Löschen Modus</b-tooltip
    >
    <b-icon v-if="!isDeleteModeOn" icon="trash" font-scale="1"></b-icon>
    <b-icon
      v-if="isDeleteModeOn"
      icon="circle-fill"
      animation="throb"
      font-scale="1"
    ></b-icon>
  </b-button>
</template>

<script>
export default {
  data() {
    return {
      isDeleteModeOn: false,
    };
  },
  methods: {
    /**
     * When we call this method, we can click and delete nodes.
     * It triggers the method changeNodeColor, which changes the color of node.
     */
    toggleDeleteMode() {
      this.$store.dispatch("toggleDeleteMode");
      if (this.isDeleteModeOn) {
        this.isDeleteModeOn = !this.isDeleteModeOn;
      } else {
        this.isDeleteModeOn = !this.isDeleteModeOn;
      }
    },
  },
};
</script>