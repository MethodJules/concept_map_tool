import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/store"

import Home from "@/components/Home"
import Login from "@/components/Login"
Vue.use(VueRouter)


const routes = [
    { path: "/", component: Home },
    { path: "/concept-map-page", name:"concept-map-page", component: Home},
    { path: "/login", name:"Login", component: Login },
    { path: "*", redirect: "/" }
    
    
];


const router = new VueRouter({
    mode: 'history',
    routes,
})


router.beforeEach( (to, from, next) => {
    let isAuthenticated = store.getters["drupal_api/getValidCredential"]; 
    // console.log(isAuthenticated)
    
    if (to.name !== 'Login' && !isAuthenticated) {
        console.log("before each")
        next({ name: 'Login' })
    }
    else {
        console.log("before each else")
        next()
    }    
})

export default router
