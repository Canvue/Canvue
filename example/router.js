import {createRouter, createWebHashHistory} from 'vue-router'

export const routes = [
    {
        path: '/',
        component: () => import('./views/TUV.vue'),
        name: 'home',
        meta: {label: "UV"}
    },
    {
        path: '/export',
        component: () => import('./views/TExport.vue'),
        name: 'export',
        meta: {label: "Export"}
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router

