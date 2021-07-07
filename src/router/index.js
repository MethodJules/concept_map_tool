import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import ConceptMapPage from "@/components/ConceptMapPage"

const routes = [
    { path: "/", component: ConceptMapPage },
    { path: "/concept-map-page", component: ConceptMapPage },
    { path: "*", redirect: "/" }


];


const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router
