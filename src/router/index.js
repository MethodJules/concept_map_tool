import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@/components/Home"
import Login from "@/components/Login"
Vue.use(VueRouter)


const routes = [
    { path: "/", component: Home },
    { path: "/concept-map-page", name: "concept-map-page", component: Home },
    { path: "/login", name: "Login", component: Login },
    { path: "*", redirect: "/" }
];


const router = new VueRouter({
    mode: 'history',
    routes,
})


router.beforeEach((to, from, next) => {
    let isAuthenticated = Boolean(sessionStorage.getItem("valid_credentials"));
    
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    else next()
})

export default router
