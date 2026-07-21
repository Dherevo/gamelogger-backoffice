import { App, AppTable, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import PauseRule from '@/models/pauseRule';
import Symptom from '@/models/symptom';
import Message from 'primevue/message';

@Component({ components: { AppTable, Message } })
class PauseRulesIndexPage extends Vue {
    table: Table = Table.create();
    message: string = Store.getSync('message');
    activeSymptomNames: string[] = [];
    hasActiveBooleanSymptoms: boolean = true;

    created() {
        Store.clear('message');
        Symptom.list({ activeOnly: true }).then(symptoms => {
            const boolNames = symptoms.filter(s => s.type === 'boolean').map(s => s.name.toLowerCase());
            this.activeSymptomNames = boolNames;
            this.hasActiveBooleanSymptoms = boolNames.length > 0;
        });
        this.configureTable();
    }

    isOrphan(rule: PauseRule): boolean {
        return !this.activeSymptomNames.includes(rule.name.toLowerCase());
    }

    goToCreate() {
        if (!this.hasActiveBooleanSymptoms) return;
        this.to('/pause-rules/create');
    }

    configureTable() {
        this.table
            .gridlines()
            .fetch(resolve => {
                PauseRule.list().then(items => {
                    this.table.pagination({ pageSize: items.length, totalResults: items.length });
                    resolve(items);
                });
            })
            .setColumns([
                { header: $t('pauseRule.labels.symptom'), name: 'name', sortable: true },
                { header: $t('pauseRule.labels.message'), name: 'message' },
                { header: $t('pauseRule.labels.status'), name: 'active' },
                { header: $t('pauseRule.labels.createdAt'), name: 'createdAt', sortable: true },
            ])
            .setItemOptions((item: PauseRule) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('pauseRule', item);
                        this.to(`/pause-rules/update/${item.id}`);
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

    toggle(rule: PauseRule) {
        const nextActive = !rule.active;
        const action = nextActive ? 'enable' : 'disable';
        const method = nextActive ? rule.enable() : rule.disable();
        method
            .then(() => {
                rule.active = nextActive;
                App.notification($t(`pauseRule.notifications.${action}.success`)).setType('success').setTime(3000).show();
            })
            .catch(() => App.notification($t(`pauseRule.notifications.${action}.error`)).setType('error').setTime(5000).show());
    }

    delete(rule: PauseRule) {
        App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('pauseRule.modals.delete.text')}</div></div>`, {
            title: $t('pauseRule.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('pauseRule.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (!ok) return;
            rule.delete()
                .then(() => this.table.refresh())
                .catch(() => App.notification($t('pauseRule.notifications.delete.error')).setType('error').setTime(5000).show());
        });
    }
}
export default toNative(PauseRulesIndexPage);
