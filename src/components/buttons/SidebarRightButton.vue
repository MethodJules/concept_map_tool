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
      no-header
      title="Sidebar"
    >
      <b-row class="sidebar-header">
        <h3>Sidebar</h3>
        <b-button size="lg" variant="dark" v-b-toggle.sidebar>x</b-button>
      </b-row>

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
function changeSidebarButtonColor() {
  const buttons = document.querySelectorAll(".menu-logoutButton");
  buttons.forEach((button) => {
    console.log(button);
    button.classList.remove("btn-secondary");
  });
}
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
  created() {
    changeSidebarButtonColor();
  },
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

.sidebar-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 1rem 0 0;
  margin-bottom: 1rem;
  background-color: #222428;
  color: white;
}
.sidebar-header button {
  width: 10%;
  height: 80%;
  padding: 0 0.5rem;
  margin: 0;
  display: flex;
  justify-content: center;
}
.sidebar-header h3 {
  width: 80%;
  font-size: 1.5rem;
}

.b-sidebar-footer button {
  background-color: #222428 !important;
}

.b-sidebar-footer button:hover {
  background-color: #111010 !important;
}
</style>