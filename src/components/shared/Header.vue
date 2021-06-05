<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="p-3 fs-5 menu">
    <b-navbar-brand to="/">Concept Map Tool</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/concept-map">Concept Map</b-nav-item>
        <b-nav-item to="/comments">Comments</b-nav-item>
        <b-nav-item to="/daily-scrum">Daily Scrum</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {};
</script>
<style scoped>
.menu {
  background-color: #3949b3 !important;
}
</style>
