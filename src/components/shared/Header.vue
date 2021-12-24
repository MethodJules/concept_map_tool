<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="menu">
      <b-navbar-brand to="/" class="menu-item hidden-mobile">
        Concept Mapping Tool
      </b-navbar-brand>
      <div class="header-buttons">
        <ConceptMapsDropdownButton />
        <RecommenderButton />
        <DeleteModeButton />
        <PrintButton />
        <SidebarRightButton />
        <div class="visible-mobile">
          <b-button
            class="menu-logoutButton"
            variant="secondary"
            @click="logout()"
          >
            <b-icon icon="box-arrow-right"></b-icon>
          </b-button>
        </div>
      </div>

      <b-row class="menu-avatar hidden-mobile" v-if="validCredential">
        <span>{{ user.name }}</span>

        <b-button
          class="menu-logoutButton"
          variant="secondary"
          @click="logout()"
        >
          <b-icon icon="box-arrow-right"></b-icon>
        </b-button>
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

export default {
  components: {
    PrintButton,
    DeleteModeButton,
    RecommenderButton,
    SidebarRightButton,
    ConceptMapsDropdownButton,
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

  methods: {
    logout() {
      this.$store.dispatch("drupal_api/logoutDrupal");
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
.menu-logoutButton {
  color: white;
  border: none;
  width: 20%;
}

.header-buttons {
  display: flex !important;
}

/* ::v-deep .nav-link {
    color: white !important;
    font-size: 1.2rem;
    padding-left: 0;
} */

/* START!! Menu items style is useless now. But I am keeping it in case we use them later or another page */
/* .menu-items ul {
    font-size: 1.5rem;
    display: flex;
    justify-content: space-around;
    width: 100%;
}
.menu-items ul li {
    margin-right: 5rem;
}
.menu-items ul li:last-child {
    margin-right: 0;
}
.menu-items ul li a {
    text-decoration: none;
    position: relative;
}
.menu-items ul li a::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0px;
    height: 3px;
    background: rgb(250, 250, 250);
    opacity: 0;
    -webkit-transition: width 1.5s; 
    transition: width 1.5s;
}
.menu-items ul li a:hover:before {
    opacity: 1;
    width: 100%;
}

.menu-items ul li a {
    color: rgb(209, 204, 204) !important;
}
.menu-items ul li a:hover {
    color: rgb(250, 250, 250) !important;
} */

/* END!! Menu items style is useless now. But I am keeping it in case we use them later or another page */
</style>
