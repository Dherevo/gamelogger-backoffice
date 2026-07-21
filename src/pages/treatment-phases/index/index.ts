import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import TreatmentPhase from '@/models/treatmentPhase';
import Message from 'primevue/message';

@Component({ components: { AppTable, FormInput, Message } })
class TreatmentPhasesIndexPage extends Vue {
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
                TreatmentPhase.list().then(items => {
                    const sorted = [...items].sort((a, b) => a.startWeek - b.startWeek);
                    this.table.pagination({ pageSize: sorted.length, totalResults: sorted.length });
                    resolve(sorted);
                });
            })
            .setColumns([
                { header: $t('generic.name'), name: 'name', sortable: true },
                { header: $t('treatmentPhase.labels.startWeek'), name: 'startWeek', sortable: true },
                { header: $t('treatmentPhase.labels.endWeek'), name: 'endWeek', sortable: true },
                { header: $t('treatmentPhase.labels.useOwnMatrix'), name: 'useOwnMatrix' },
            ])
            .setItemOptions((item: TreatmentPhase) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        Store.set('treatmentPhase', item);
                        this.to(`/treatment-phases/update/${item.id}`);
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

    delete(phase: TreatmentPhase) {
        App.confirm(`<div class="flex-row gap10"><i class="pi pi-exclamation-triangle"></i><div>${$t('treatmentPhase.modals.delete.text')}</div></div>`, {
            title: $t('treatmentPhase.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('treatmentPhase.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) phase.delete().then(() => this.table.refresh());
        });
    }
}
export default toNative(TreatmentPhasesIndexPage);
