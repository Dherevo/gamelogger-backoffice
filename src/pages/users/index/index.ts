import { App, AppTable, FormInput, IOption, PaginatorStructure, Store, Table, $t } from 'lib';
import type { TableFilter } from 'lib/src/widgets/app-table/table';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import User from '@/models/user';
import Message from 'primevue/message';

// Filters the list sends to the API (anything else in table.filters, like URL state, is ignored).
const FILTER_KEYS = ['admin', 'steam', 'visibility', 'locale', 'games', 'created_from', 'created_to', 'deleted'];

@Component({
    components: { AppTable, FormInput, Message }
})
class UsersIndexPage extends Vue {

    table: Table = Table.create();
    message: string = Store.getSync('message');

    created() {
        Store.clear('message');
        this.configureTable();
    }

    yesNo(): IOption[] {
        return [
            { value: '1', content: $t('generic.yes') },
            { value: '0', content: $t('generic.no') },
        ];
    }

    filters(): TableFilter[] {
        const select = (name: string, label: string, options: IOption[], width = 150): TableFilter => ({
            type: 'select', name, label, width, props: { options, required: false },
        });

        return [
            select('admin', $t('users.labels.admin'), this.yesNo()),
            select('steam', $t('users.labels.steamLinked'), this.yesNo()),
            select('visibility', $t('users.labels.visibility'), ['public', 'friends', 'private']
                .map(v => ({ value: v, content: $t(`users.visibility.${v}`) }))),
            select('locale', $t('users.labels.locale'), [
                { value: 'ca', content: 'Català' },
                { value: 'es', content: 'Castellano' },
                { value: 'en', content: 'English' },
                { value: 'none', content: $t('users.filters.localeNone') },
            ]),
            select('games', $t('users.filters.hasGames'), this.yesNo()),
            { type: 'date', name: 'created_from', label: $t('users.filters.createdFrom'), width: 160 },
            { type: 'date', name: 'created_to', label: $t('users.filters.createdTo'), width: 160 },
            select('deleted', $t('users.filters.deactivated'), this.yesNo()),
        ];
    }

    /** The date filters hold a Time object; the API wants YYYY-MM-DD. */
    filterValue(value: any): any {
        return value && typeof value.format === 'function' ? value.format('YYYY-MM-DD') : value;
    }

    configureTable() {
        this.table
            .gridlines()
            .setFilters(this.filters())
            .fetch(resolve => {
                const params: any = {
                    search: this.table.filters.search,
                    offset: this.table.offset,
                    pageSize: this.table.pageSize,
                };
                for (const key of FILTER_KEYS) {
                    const value = this.filterValue(this.table.filters[key]);
                    if (value !== undefined && value !== null && value !== '') params[key] = value;
                }
                if (this.table.sort) {
                    params.sort_by = this.table.sort.by;
                    params.sort_order = this.table.sort.order.toLowerCase();
                }

                User.list(params).then(response => {
                    this.table.pagination({
                        resultsPerPage: response.pageSize,
                        totalResults: response.total,
                    });
                    resolve(response.items);
                });
            })
            .setColumns([
                {
                    header: $t('generic.name'),
                    name: 'name',
                    sortable: true,
                },
                {
                    header: $t('users.labels.nickname'),
                    name: 'nickname',
                    sortable: true,
                },
                {
                    header: $t('generic.email'),
                    name: 'email',
                    sortable: true,
                },
                {
                    header: $t('users.labels.steamId'),
                    name: 'steam_id',
                    sortable: true,
                    value: (item: User) => item.steam_id || '',
                },
                {
                    header: $t('users.labels.locale'),
                    name: 'locale',
                    sortable: true,
                    value: (item: User) => item.locale ? item.locale.toUpperCase() : '',
                },
                {
                    header: $t('users.labels.visibility'),
                    name: 'profile_visibility',
                    sortable: true,
                    value: (item: User) => $t(`users.visibility.${item.profile_visibility || 'public'}`),
                },
                {
                    header: $t('users.labels.games'),
                    name: 'games_count',
                    sortable: true,
                    value: (item: User) => String(item.games_count ?? 0),
                },
                {
                    header: $t('users.labels.lastSync'),
                    name: 'steam_last_synced_at',
                    sortable: true,
                    value: (item: User) => item.steam_last_synced_at ? String(item.steam_last_synced_at).slice(0, 16).replace('T', ' ') : '',
                },
                {
                    header: $t('users.labels.createdAt'),
                    name: 'created_at',
                    sortable: true,
                    value: (item: User) => item.created_at ? String(item.created_at).slice(0, 10) : '',
                },
                {
                    header: $t('users.labels.admin'),
                    name: 'isAdmin',
                    value: (item: User) => item.isAdmin ? $t('generic.yes') : $t('generic.no'),
                },
            ])
            .setItemOptions((item: User) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('user', item);
                        this.to(`/users/update/${item.id}`);
                    },
                },
                {
                    label: $t('generic.delete'),
                    icon: 'prime/trash',
                    command: () => {
                        this.delete(item);
                    },
                },
            ], 'alwaysIcons')
            .paginator(
                PaginatorStructure.create()
                    .Text($t('backoffice.pagination', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' }))
                    .FirstPage().PrevPage().Numbers().NextPage().LastPage().PerPageSelector(),
                25
            );
    }

    delete(user: User) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('users.modals.delete.text')}</div>
        </div>`, {
            title: $t('users.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('users.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                user.delete()
                    .then(() => this.table.refresh())
                    .catch(() => App.notification($t('users.modals.delete.error')).setType('error').setTime(5000).show());
            }
        });
    }

}
export default toNative(UsersIndexPage);
