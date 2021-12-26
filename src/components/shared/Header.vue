<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="menu">
      <b-navbar-brand to="/" class="menu-item hidden-mobile">
        Concept Mapping Tool
      </b-navbar-brand>
      <div class="header-buttons" v-if="validCredential">
        <img
          src="@/assets/favicon.png"
          class="visible-mobile"
          width="30"
          height="30"
          alt=""
        />

        <ConceptMapsDropdownButton />
        <RecommenderButton />
        <DeleteModeButton />
        <PrintButton />
        <FullScreenButton />
        <SidebarRightButton />

        <div class="visible-mobile">
          <LogoutButton />
        </div>
      </div>

      <b-row class="menu-avatar hidden-mobile" v-if="validCredential">
        <span>{{ user.name }}</span>

        <LogoutButton />
      </b-row>
    </b-navbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import PrintButton from "@/components/buttons/PrintButton";
import DeleteModeButton from "@/components/buttons/DeleteModeButton";
import RecommenderButton from "@/components/buttons/RecommenderButton";
import SidebarRightButton from "@/components/buttons/SidebarRightButton";
import ConceptMapsDropdownButton from "@/components/buttons/ConceptMapsDropdownButton";
import LogoutButton from "@/components/buttons/LogoutButton";
import FullScreenButton from "@/components/buttons/FullScreenButton";

export default {
  data() {
    return {};
  },
  components: {
    PrintButton,
    DeleteModeButton,
    RecommenderButton,
    SidebarRightButton,
    ConceptMapsDropdownButton,
    LogoutButton,
    FullScreenButton,
  },

  computed: {
    ...mapGetters({
      user: "drupal_api/getUser", // getter to take datas of the user.
    }),
    account() {
      return this.$store.state.sparky_api.account;
    },

    validCredential() {
      // return true;
      // return this.$store.state.sparky_api.validCredential;
      return this.$store.state.drupal_api.validCredential;
    },
  },
};
</script>
<style scoped>
@media (max-width: 767px) {
  .hidden-mobile {
    display: none !important;
  }

  .menu {
    padding: 0 !important;
  }
  .header-buttons {
    width: 100%;
  }
}
@media (min-width: 767px) {
  .visible-mobile {
    display: none !important;
  }
}
.menu {
  background-color: #6c757d !important;
  display: flex;
  justify-content: space-between;
  padding: 0.1rem 2rem;
  flex-wrap: nowrap;
}
.menu-item {
  margin: 0;
}
.menu li {
  list-style-type: none;
}
.menu-avatar {
  min-width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.menu-avatar span {
  width: 50%;
  padding: 0;
  margin-right: 0.5rem;
  color: white;
}
.header-buttons {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
