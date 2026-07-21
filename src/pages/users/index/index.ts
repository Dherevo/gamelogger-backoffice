import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import User from '@/models/user';
import Message from 'primevue/message';

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

    configureTable() {
        this.table
            .gridlines()
            .fetch(resolve => {
                User.list({
                    search: this.table.filters.search,
                    offset: this.table.offset,
                    pageSize: this.table.pageSize,
                }).then(response => {
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
