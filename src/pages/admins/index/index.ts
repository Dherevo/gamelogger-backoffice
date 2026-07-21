import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Admin from '@/models/admin';
import Message from 'primevue/message';

@Component({
    components: { AppTable, FormInput, Message }
})
class AdminsIndexPage extends Vue {

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
                Admin.list({
                    search: this.table.filters.search,
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                }).then(response => {
                    this.table.pagination({
                        pageSize: response.perPage,
                        totalResults: response.totalItems,
                    });
                    resolve(response.items);
                });
            })
            .setColumns([
                {
                    header: $t('generic.name'),
                    name: 'fullName',
                    sortable: true,
                },
                {
                    header: $t('generic.username'),
                    name: 'username',
                    sortable: true,
                },
                {
                    header: $t('generic.email'),
                    name: 'email',
                    sortable: true,
                },
                {
                    header: $t('admin.labels.role'),
                    name: 'role',
                    value: (item: Admin) => Admin.roleOptions.find(o => o.value === item.role)?.content as string || '',
                },
                {
                    header: $t('admin.labels.distributionCenter'),
                    name: 'distributionCenterName',
                    value: (item: Admin) => item.role !== 0 ? (item.distributionCenterName || '—') : '',
                },
                {
                    header: $t('admin.labels.registered'),
                    name: 'registered',
                    value: (item: Admin) => item.registered ? item.registered.format('DD/MM/YYYY') : '',
                },
            ])
            .setItemOptions((item: Admin) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('admin', item);
                        this.to(`/admins/update/${item.id}`);
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

    delete(admin: Admin) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('admin.modals.delete.text')}</div>
        </div>`, {
            title: $t('admin.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('admin.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                admin.delete().then(() => this.table.refresh());
            }
        });
    }

}
export default toNative(AdminsIndexPage);
