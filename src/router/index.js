import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import ConceptMap from "@/components/ConceptMap"
import Comments from "@/components/Comments"
import DailyScrum from "@/components/DailyScrum"

const routes = [
    { path: "/", component: ConceptMap },
    { path: "/concept-map", component: ConceptMap },
    { path: "/comments", component: Comments },
    { path: "/daily-scrum", component: DailyScrum },
    { path: "*", redirect: "/" }


];


const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router
