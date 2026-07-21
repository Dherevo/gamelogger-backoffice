import { $t } from 'lib';

type IMenuItem = {
    label: string,
    icon?: string,
    class?: string,
    to?: string
    onClick?: () => void,
    items?: IMenuItem[]
}
export type {
    IMenuItem
}

const menuItems: ($router: any) => Promise<IMenuItem[]>
= (_$router: any) => {
    const items: IMenuItem[] = [
        {
            label: $t('backoffice.sidebar.users.label'),
            items: [
                {
                    label: $t('backoffice.sidebar.users.items.patients'),
                    icon: 'prime/user',
                    to: '/patients',
                    class: location.pathname.startsWith('/patients') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.users.items.admins'),
                    icon: 'prime/users',
                    to: '/admins',
                    class: location.pathname.startsWith('/admins') ? 'active' : '',
                },
            ],
        },
        {
            label: $t('backoffice.sidebar.configuration.label'),
            items: [
                {
                    label: $t('backoffice.sidebar.configuration.items.skinTypes'),
                    icon: 'prime/sun',
                    to: '/skin-types',
                    class: location.pathname.startsWith('/skin-types') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.symptoms'),
                    icon: 'prime/list',
                    to: '/symptoms',
                    class: location.pathname.startsWith('/symptoms') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.pauseRules'),
                    icon: 'prime/pause-circle',
                    to: '/pause-rules',
                    class: location.pathname.startsWith('/pause-rules') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.productCategories'),
                    icon: 'prime/tag',
                    to: '/product-categories',
                    class: location.pathname.startsWith('/product-categories') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.products'),
                    icon: 'prime/box',
                    to: '/products',
                    class: location.pathname.startsWith('/products') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.treatmentActions'),
                    icon: 'prime/bolt',
                    to: '/treatment-actions',
                    class: location.pathname.startsWith('/treatment-actions') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.decisionMatrix'),
                    icon: 'prime/table',
                    to: '/decision-matrix',
                    class: location.pathname.startsWith('/decision-matrix') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.configuration.items.treatmentPhases'),
                    icon: 'prime/calendar',
                    to: '/treatment-phases',
                    class: location.pathname.startsWith('/treatment-phases') ? 'active' : '',
                },
            ],
        },
    ];

    return Promise.resolve(items);
};
export default menuItems;
