import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import SkinType from '@/models/skinType';
import Message from 'primevue/message';

@Component({ components: { AppTable, FormInput, Message } })
class SkinTypesIndexPage extends Vue {
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
                SkinType.list().then(items => {
                    this.table.pagination({ pageSize: items.length, totalResults: items.length });
                    resolve(items);
                });
            })
            .setColumns([
                { header: $t('generic.name'), name: 'name', sortable: true },
                { header: $t('generic.description'), name: 'description' },
                { header: $t('skinType.labels.active'), name: 'active' },
            ])
            .setItemOptions((item: SkinType) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('skinType', item);
                        this.to(`/skin-types/update/${item.id}`);
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

    toggleStatus(skinType: SkinType) {
        const method = skinType.active ? skinType.disable() : skinType.enable();
        const action = skinType.active ? 'disable' : 'enable';
        method
            .then(() => {
                skinType.active = !skinType.active;
                App.notification($t(`skinType.notifications.${action}.success`)).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t(`skinType.notifications.${action}.error`)).setType('error').setTime(5000).show());
    }

    delete(skinType: SkinType) {
        App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('skinType.modals.delete.text')}</div></div>`, {
            title: $t('skinType.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('skinType.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) skinType.delete().then(() => this.table.refresh());
        });
    }
}
export default toNative(SkinTypesIndexPage);
