<template>
    <b-navbar toggleable="lg" type="dark" variant="primary" class="menu">
        <b-navbar-brand to="/"> Concept Mapping Tool</b-navbar-brand>
        <!-- <b-navbar-brand to="/login"> Login</b-navbar-brand> -->
        <b-navbar-brand>
            <b-icon @click="logout()" icon="box-arrow-right"></b-icon>
        </b-navbar-brand>
    </b-navbar>
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
.logoutButton {
    color: white;
    background-color: #3949b3;
    border: none;
}

.menu {
    background-color: #3949b3 !important;
    display: flex;
    justify-content: space-between;
    padding: 1rem 4rem;
    height: 8vh;
}
.menu * {
    font-size: 1.7rem;
}

/* START!! Menu items style is useless now. But I am keeping it in case we use them later or another page */
.menu-items ul {
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
    -webkit-transition: width 1.5s; /* Safari */
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
}

/* END!! Menu items style is useless now. But I am keeping it in case we use them later or another page */
</style>
