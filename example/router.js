import {createRouter, createWebHashHistory} from 'vue-router'

export const routes = [{
    path: '/',
    component: () => import('./views/TestUV.vue'),
    name: 'home',
    meta: {label: "UV"}
}]


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router

