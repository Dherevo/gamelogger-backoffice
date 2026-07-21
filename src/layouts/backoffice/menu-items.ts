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
                    label: $t('backoffice.sidebar.users.items.list'),
                    icon: 'prime/users',
                    to: '/users',
                    class: location.pathname.startsWith('/users') ? 'active' : '',
                },
            ],
        },
        {
            label: $t('backoffice.sidebar.catalog.label'),
            items: [
                {
                    label: $t('backoffice.sidebar.catalog.items.games'),
                    icon: 'prime/box',
                    to: '/games',
                    class: location.pathname.startsWith('/games') ? 'active' : '',
                },
                {
                    label: $t('backoffice.sidebar.catalog.items.platforms'),
                    icon: 'prime/desktop',
                    to: '/platforms',
                    class: location.pathname.startsWith('/platforms') ? 'active' : '',
                },
            ],
        },
    ];

    return Promise.resolve(items);
};
export default menuItems;
