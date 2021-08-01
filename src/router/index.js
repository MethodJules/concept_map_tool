import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Home from "@/components/Home"
import Login from "@/components/Login"

const routes = [
    { path: "/", component: Home },
    { path: "/concept-map-page", component: Home },
    { path: "/login", component: Login },
    { path: "*", redirect: "/" }


];


const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router
