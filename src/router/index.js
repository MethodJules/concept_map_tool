import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import ConceptMapPage from "@/components/ConceptMapPage"
import Comments from "@/components/Comments"
import DailyScrum from "@/components/DailyScrum"

const routes = [
    { path: "/", component: ConceptMapPage },
    { path: "/concept-map-page", component: ConceptMapPage },
    { path: "/comments", component: Comments },
    { path: "/daily-scrum", component: DailyScrum },
    { path: "*", redirect: "/" }


];


const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router
