import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Product from '@/models/product';
import ProductCategory from '@/models/productCategory';
import Message from 'primevue/message';

@Component({ components: { AppTable, FormInput, Message } })
class ProductsIndexPage extends Vue {
    table: Table = Table.create();
    message: string = Store.getSync('message');
    activeTab: string = 'products';
    categories: ProductCategory[] = [];
    selectedCategoryId: string = '';

    created() {
        Store.clear('message');
        ProductCategory.list().then(cats => { this.categories = cats; });
        this.configureTable();
    }

    get categoryOptions() {
        return [
            { value: '', content: $t('product.filters.allCategories') },
            ...this.categories.map(c => ({ value: c.id, content: c.name })),
        ];
    }

    configureTable() {
        this.table
            .gridlines()
            .fetch(resolve => {
                Product.list(this.selectedCategoryId || undefined).then(items => {
                    this.table.pagination({ pageSize: items.length, totalResults: items.length });
                    resolve(items);
                });
            })
            .setColumns([
                { header: $t('generic.name'), name: 'name', sortable: true },
                { header: $t('product.labels.category'), name: 'categoryName', sortable: true },
                { header: $t('generic.description'), name: 'description' },
                { header: $t('product.labels.active'), name: 'active' },
            ])
            .setItemOptions((item: Product) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('product', item);
                        this.to(`/products/update/${item.id}`);
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

    filterByCategory() {
        this.table.refresh();
    }

    toggleStatus(product: Product) {
        const method = product.active ? product.disable() : product.enable();
        const action = product.active ? 'disable' : 'enable';
        method
            .then(() => {
                product.active = !product.active;
                App.notification($t(`product.notifications.${action}.success`)).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t(`product.notifications.${action}.error`)).setType('error').setTime(5000).show());
    }

    delete(product: Product) {
        App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('product.modals.delete.text')}</div></div>`, {
            title: $t('product.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('product.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) product.delete().then(() => this.table.refresh());
        });
    }
}
export default toNative(ProductsIndexPage);
