import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import ProductCategory from '@/models/productCategory';
import Message from 'primevue/message';

@Component({ components: { AppTable, FormInput, Message } })
class ProductCategoriesIndexPage extends Vue {
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
                ProductCategory.list().then(items => {
                    this.table.pagination({ pageSize: items.length, totalResults: items.length });
                    resolve(items);
                });
            })
            .setColumns([
                { header: $t('generic.name'), name: 'name', sortable: true },
            ])
            .setItemOptions((item: ProductCategory) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('productCategory', item);
                        this.to(`/product-categories/update/${item.id}`);
                    },
                },
                {
                    label: $t('generic.delete'),
                    icon: 'prime/trash',
                    command: () => this.delete(item),
                },
            ], 'alwaysIcons')
            .paginator(
                PaginatorStructure.create()
                    .Text($t('backoffice.pagination', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' }))
                    .FirstPage().PrevPage().Numbers().NextPage().LastPage().PerPageSelector(),
                25
            );
    }

    delete(category: ProductCategory) {
        App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('productCategory.modals.delete.text')}</div></div>`, {
            title: $t('productCategory.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('productCategory.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (!ok) return;
            category.delete()
                .then(() => this.table.refresh())
                .catch(() => App.notification($t('productCategory.notifications.delete.error')).setType('error').setTime(5000).show());
        });
    }
}
export default toNative(ProductCategoriesIndexPage);
