import {createRouter, createWebHashHistory} from 'vue-router'

export const routes = [
    {
        path: '/',
        component: () => import('./views/TProjected.vue'),
        name: 'home',
        meta: {label: "Projected"}
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

