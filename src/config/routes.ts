import { IRoute, http } from 'lib';

const routes: IRoute[] = [
    {
        path: '/',
        redirect: () => http.token.get() ? '/users' : '/login',
    },
    {
        path: '',
        component: () => import('../layouts/default/default.vue'),
        children: [
            {
                path: 'login',
                component: () => import('../pages/login/login.vue'),
            },
            {
                path: 'reset-password',
                component: () => import('../pages/reset-password/reset-password.vue'),
            },
            {
                path: 'reset-password/:token',
                component: () => import('../pages/reset-password/reset-password.vue'),
            },
            {
                path: '404',
                component: () => import('../pages/404/404.vue'),
            },
        ]
    },
    {
        path: '',
        component: () => import('../layouts/backoffice/backoffice.vue'),
        children: [
            {
                path: 'dashboard',
                component: () => import('../pages/home/home.vue'),
            },
            // Users
            {
                path: 'users',
                component: () => import('../pages/users/index/index.vue'),
            },
            {
                path: 'users/create',
                component: () => import('../pages/users/create/create.vue'),
            },
            {
                path: 'users/update/:id',
                component: () => import('../pages/users/update/update.vue'),
            },
            // Games
            {
                path: 'games',
                component: () => import('../pages/games/index/index.vue'),
            },
            {
                path: 'games/create',
                component: () => import('../pages/games/create/create.vue'),
            },
            {
                path: 'games/update/:id',
                component: () => import('../pages/games/update/update.vue'),
            },
            // Platforms
            {
                path: 'platforms',
                component: () => import('../pages/platforms/index/index.vue'),
            },
            {
                path: 'platforms/create',
                component: () => import('../pages/platforms/create/create.vue'),
            },
            {
                path: 'platforms/update/:id',
                component: () => import('../pages/platforms/update/update.vue'),
            },
            // [CLI] <-- Leave this mark here so the CLI can add new routes automatically
        ]
    },

    // Leave always 404 Page always at the end
    {
        path: "/:catchAll(.*)",
        redirect: '/404',
    },
]
export default routes;
