import { IRoute, http } from 'lib';

const routes: IRoute[] = [
    {
        path: '/',
        redirect: () => http.token.get() ? '/patients' : '/login',
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
                path: 'recover',
                component: () => import('../pages/recover/recover.vue'),
            },
            {
                path: 'reset-password',
                component: () => import('../pages/reset-password/reset-password.vue'),
            },
            {
                path: 'verify-email',
                component: () => import('../pages/verify-email/verify-email.vue'),
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
            {
                path: 'profile',
                component: () => import('../pages/profile/profile.vue'),
            },
            // Patients
            {
                path: 'patients',
                component: () => import('../pages/patients/index/index.vue'),
            },
            {
                path: 'patients/create',
                component: () => import('../pages/patients/create/create.vue'),
            },
            {
                path: 'patients/update/:id',
                component: () => import('../pages/patients/update/update.vue'),
            },
            // Admins
            {
                path: 'admins',
                component: () => import('../pages/admins/index/index.vue'),
            },
            {
                path: 'admins/create',
                component: () => import('../pages/admins/create/create.vue'),
            },
            {
                path: 'admins/update/:id',
                component: () => import('../pages/admins/update/update.vue'),
            },
            // Distributors
            {
                path: 'distributors',
                component: () => import('../pages/distributors/index/index.vue'),
            },
            {
                path: 'distributors/create',
                component: () => import('../pages/distributors/create/create.vue'),
            },
            {
                path: 'distributors/update/:id',
                component: () => import('../pages/distributors/update/update.vue'),
            },
            // Skin types
            {
                path: 'skin-types',
                component: () => import('../pages/skin-types/index/index.vue'),
            },
            {
                path: 'skin-types/create',
                component: () => import('../pages/skin-types/create/create.vue'),
            },
            {
                path: 'skin-types/update/:id',
                component: () => import('../pages/skin-types/update/update.vue'),
            },
            // Symptoms
            {
                path: 'symptoms',
                component: () => import('../pages/symptoms/index/index.vue'),
            },
            {
                path: 'symptoms/create',
                component: () => import('../pages/symptoms/create/create.vue'),
            },
            {
                path: 'symptoms/update/:id',
                component: () => import('../pages/symptoms/update/update.vue'),
            },
            // Pause rules
            {
                path: 'pause-rules',
                component: () => import('../pages/pause-rules/index/index.vue'),
            },
            {
                path: 'pause-rules/create',
                component: () => import('../pages/pause-rules/create/create.vue'),
            },
            {
                path: 'pause-rules/update/:id',
                component: () => import('../pages/pause-rules/update/update.vue'),
            },
            // Products
            {
                path: 'products',
                component: () => import('../pages/products/index/index.vue'),
            },
            {
                path: 'products/create',
                component: () => import('../pages/products/create/create.vue'),
            },
            {
                path: 'products/update/:id',
                component: () => import('../pages/products/update/update.vue'),
            },
            // Decision Matrix
            {
                path: 'decision-matrix',
                component: () => import('../pages/decision-matrix/index/index.vue'),
            },
            // Treatment actions
            {
                path: 'treatment-actions',
                component: () => import('../pages/treatment-actions/index/index.vue'),
            },
            // Product categories
            {
                path: 'product-categories',
                component: () => import('../pages/product-categories/index/index.vue'),
            },
            {
                path: 'product-categories/create',
                component: () => import('../pages/product-categories/create/create.vue'),
            },
            {
                path: 'product-categories/update/:id',
                component: () => import('../pages/product-categories/update/update.vue'),
            },
            // Treatment phases
            {
                path: 'treatment-phases',
                component: () => import('../pages/treatment-phases/index/index.vue'),
            },
            {
                path: 'treatment-phases/create',
                component: () => import('../pages/treatment-phases/create/create.vue'),
            },
            {
                path: 'treatment-phases/update/:id',
                component: () => import('../pages/treatment-phases/update/update.vue'),
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
