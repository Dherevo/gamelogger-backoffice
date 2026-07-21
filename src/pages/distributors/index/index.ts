import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Distributor from '@/models/distributor';
import Message from 'primevue/message';

@Component({
    components: { AppTable, FormInput, Message }
})
class DistributorsIndexPage extends Vue {

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
                Distributor.list({
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
                    header: $t('distributor.labels.name'),
                    name: 'name',
                    sortable: true,
                },
                {
                    header: $t('distributor.labels.country'),
                    name: 'country',
                    sortable: true,
                },
                {
                    header: $t('generic.email'),
                    name: 'email',
                    sortable: true,
                },
                {
                    header: $t('generic.phone'),
                    name: 'telephone',
                },
                {
                    header: $t('distributor.labels.status'),
                    name: 'status',
                },
            ])
            .setItemOptions((item: Distributor) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('distributor', item);
                        this.to(`/distributors/update/${item.id}`);
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

    toggleStatus(distributor: Distributor) {
        const method = distributor.status ? distributor.disable() : distributor.enable();
        const action = distributor.status ? 'disable' : 'enable';
        method
            .then(() => {
                distributor.status = !distributor.status;
                App.notification($t(`distributor.notifications.${action}.success`)).setType('success').setTime(3000).show();
            })
            .catch(() => {
                App.notification($t(`distributor.notifications.${action}.error`)).setType('error').setTime(5000).show();
            });
    }

    delete(distributor: Distributor) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('distributor.modals.delete.text')}</div>
        </div>`, {
            title: $t('distributor.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('distributor.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                distributor.delete().then(() => this.table.refresh());
            }
        });
    }

}
export default toNative(DistributorsIndexPage);
