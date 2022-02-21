import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@/components/Home"
import Login from "@/components/Login"
import ConceptMapForXnavi from "@/components/ConceptMapForXnavi"
Vue.use(VueRouter)


const routes = [
    {
        path: "/", component: Home, meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/concept-map-page", name: "concept-map-page", component: Home, meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/concept-map/:conceptMapId", name: "concept-map", component: ConceptMapForXnavi, meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/login", name: "Login", component: Login, meta: {
            requiresAuth: false,
        },
    },
    {
        path: "*", redirect: "/", meta: {
            requiresAuth: true,
        },
    }
];


const router = new VueRouter({
    mode: 'history',
    routes,
})


router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        let isAuthenticated = Boolean(sessionStorage.getItem("valid_credentials"));
        if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
        else next()
    } else {
        next()
    }

})

export default router
