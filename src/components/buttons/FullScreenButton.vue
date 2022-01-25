<template>
  <b-button
    class="tools-buttonsDeleteMode"
    size="sm"
    variant="secondary"
    id="fullScreenButton"
    @click="toggleApi"
  >
    <b-tooltip
      target="fullScreenButton"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Fullscreen</b-tooltip
    >
    <b-icon icon="arrows-fullscreen" font-scale="1"></b-icon>
  </b-button>
</template>
<script>
export default {
  data() {
    return {
      fullscreen: false,
    };
  },
  methods: {
    /**
     * Opens and closes full screen.
     */
    toggleApi() {
      const map = document.querySelector("#map");
      this.$fullscreen.toggle(map);
    },
  },
};
</script>