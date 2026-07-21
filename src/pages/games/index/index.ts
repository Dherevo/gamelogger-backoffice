import { App, AppTable, FormInput, PaginatorStructure, Store, Table, $t } from 'lib';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Game from '@/models/game';
import Message from 'primevue/message';

@Component({
    components: { AppTable, FormInput, Message }
})
class GamesIndexPage extends Vue {

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
                Game.list({
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
                    header: $t('game.labels.name'),
                    name: 'name',
                    sortable: true,
                },
                {
                    header: $t('game.labels.year'),
                    name: 'year',
                },
                {
                    header: $t('game.labels.publisher'),
                    name: 'publisher',
                },
                {
                    header: $t('game.labels.developer'),
                    name: 'developer',
                },
                {
                    header: $t('game.labels.hidden'),
                    name: 'hide',
                    value: (item: Game) => item.hide ? $t('generic.yes') : $t('generic.no'),
                },
            ])
            .setItemOptions((item: Game) => [
                {
                    label: $t('generic.edit'),
                    icon: 'prime/pencil',
                    command: () => {
                        this.to(`/games/update/${item.id}`);
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

    delete(game: Game) {
        App.confirm(`<div class="flex-row gap10">
            <i class="pi pi-exclamation-triangle"></i>
            <div>${$t('game.modals.delete.text')}</div>
        </div>`, {
            title: $t('game.modals.delete.title'),
            cancelButton: { content: $t('generic.cancel'), class: 'primary-dark backoffice' },
            confirmButton: { content: $t('game.modals.delete.button'), class: 'danger', icon: 'prime/trash' },
        }).then((ok: boolean) => {
            if (ok) {
                game.delete()
                    .then(() => this.table.refresh())
                    .catch(error => {
                        const msg = error?.data?.error === 'game.has_library_entries'
                            ? $t('game.errors.hasLibraryEntries')
                            : $t('game.modals.delete.error');
                        App.notification(msg).setType('error').setTime(5000).show();
                    });
            }
        });
    }

}
export default toNative(GamesIndexPage);
