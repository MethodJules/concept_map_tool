<template>
    <b-navbar toggleable="lg" type="dark" class="menu">
        <b-navbar-brand to="/" class="menu-item">
            Concept Mapping Tool</b-navbar-brand
        >
        <!-- <b-navbar-brand to="/login"> Login</b-navbar-brand> -->
        <b-row class="menu-avatar" v-if="validCredential">
            <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
            ></b-avatar>
            <b-nav-item-dropdown class="menu-dropdown" :text="user.name" right>
                <b-dropdown-item>Account</b-dropdown-item>
                <b-dropdown-item>Settings</b-dropdown-item>
                <b-dropdown-item>
                    Logout
                    <b-icon @click="logout()" icon="box-arrow-right"></b-icon>
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </b-row>
    </b-navbar>
</template>
<script>
import { mapGetters } from "vuex";

export default {
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
.logoutButton {
    color: white;
    background-color: #3949b3;
    border: none;
}

.menu {
    background-color: #3949b3 !important;
    display: flex;
    justify-content: space-between;
    padding: 0.7rem 2rem;
}

.menu-item {
    font-size: 1.7rem;
}
.menu li {
    list-style-type: none;
}

.menu-avatar {
    min-width: 200px;
    display: flex;
    justify-content: flex-end;
}
.menu-avatar li {
    width: 70%;
    padding: 0;
}
.menu-avatar span {
    width: 25%;
    padding: 0;
    margin-right: 0.5rem;
}
::v-deep .nav-link {
    color: white !important;
    font-size: 1.2rem;
    padding-left: 0;
}

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
