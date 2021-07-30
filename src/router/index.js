import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import ConceptMapPage from "@/components/ConceptMapPage"
import Login from "@/components/Login"

const routes = [
    { path: "/", component: ConceptMapPage },
    { path: "/concept-map-page", component: ConceptMapPage },
    { path: "/login", component: Login },
    { path: "*", redirect: "/" }


];


const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router
