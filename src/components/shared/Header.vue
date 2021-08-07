<template>
    <b-navbar toggleable="lg" type="dark" variant="primary" class="menu">
        <b-navbar-brand to="/"> Concept Mapping Tool</b-navbar-brand>

        <!-- <div class="menu-items">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/concept-map">Concept Map</b-nav-item>
                </b-navbar-nav>
            </b-collapse> 
        </div> -->
    </b-navbar>
</template>
<script>
export default {};
</script>
<style scoped>
.menu {
    background-color: #3949b3 !important;
    display: flex;
    justify-content: center;
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
