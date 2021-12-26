<template>
  <div>
    <b-button v-b-toggle.sidebar id="sidebarButton">
      <b-icon icon="layout-sidebar-inset-reverse" font-scale="1"></b-icon>
    </b-button>
    <b-tooltip
      target="sidebarButton"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Sidebar</b-tooltip
    >
    <b-sidebar
      id="sidebar"
      aria-label="Sidebar with custom footer"
      shadow
      right
      title="Sidebar"
    >
      <ConceptMapOptions />
      <Tags />
      <template #footer="{}">
        <div class="sidebar-footer">
          <strong class="mr-auto">{{ user.name }}</strong>
          <LogoutButton />
        </div>
      </template>
    </b-sidebar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LogoutButton from "@/components/buttons/LogoutButton";
import Tags from "@/components/Tags";
import ConceptMapOptions from "@/components/ConceptMapOptions";

export default {
  data() {
    return {
      newTag: "",
    };
  },
  components: {
    LogoutButton,
    Tags,
    ConceptMapOptions,
  },
  computed: {
    ...mapGetters({
      conceptMaps: "conceptMap/getConceptMaps",
      index: "conceptMap/getIndex",
      activeConceptMap: "conceptMap/getActiveConceptMap",
      user: "drupal_api/getUser",
    }),
  },

  methods: {},
};
</script>
<style scoped>
#sidebar {
  padding: 1rem;
}
::v-deep .b-sidebar-body {
  padding: 0 0.5rem !important;
}
.sidebar-footer {
  display: flex;
  background-color: #222428;
  color: #f3f4f5;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}
.menu-logoutButton {
  background-color: #222428;
}
</style>