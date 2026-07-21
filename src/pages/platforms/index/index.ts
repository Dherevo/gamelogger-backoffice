import { App, AppTable, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Platform from '@/models/platform';
import Message from 'primevue/message';

@Component({
    components: { AppTable, Message }
})
class PlatformsIndexPage extends Vue {

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
                Platform.list().then(items => resolve(items));
            })
            .setColumns([
                {
                    header: $t('platform.labels.name'),
                    name: 'name',
                    sortable: true,
                },
            ])
            .setItemOptions((item: Platform) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('platform', item);
                        this.to(`/platforms/update/${item.id}`);
                    },
                },
                {
                    label: $t('generic.delete'),
                    icon: 'prime/trash',
                    command: () => {
                        this.delete(item);
                    },
                },
            ], 'alwaysIcons');
    }

    delete(platform: Platform) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('platform.modals.delete.text')}</div>
        </div>`, {
            title: $t('platform.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('platform.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                platform.delete()
                    .then(() => this.table.refresh())
                    .catch(error => {
                        const msg = error?.data?.error === 'platform.in_use'
                            ? $t('platform.errors.inUse')
                            : $t('platform.modals.delete.error');
                        App.notification(msg).setType('error').setTime(5000).show();
                    });
            }
        });
    }

}
export default toNative(PlatformsIndexPage);
