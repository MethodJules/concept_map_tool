<template>
  <b-button class="menu-logoutButton" variant="secondary" @click="logout()">
    <b-icon icon="box-arrow-right"></b-icon>
  </b-button>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("drupal_api/logoutDrupal");
    },
  },
};
</script>

<style scoped>
.menu-logoutButton {
  color: white;
  border: none;
  width: 20%;
}
</style>