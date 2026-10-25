import { App, AppTable, FormInput, IOption, PaginatorStructure, Store, Table, $t } from 'lib';
import type { TableFilter } from 'lib/src/widgets/app-table/table';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Game from '@/models/game';
import Platform from '@/models/platform';
import Message from 'primevue/message';

// Filters the list sends to the API (anything else in table.filters, like URL state, is ignored).
const FILTER_KEYS = ['publisher', 'developer', 'year_from', 'year_to', 'hidden', 'manual', 'story', 'achievements', 'platform_id', 'missing'];

@Component({
    components: { AppTable, FormInput, Message }
})
class GamesIndexPage extends Vue {

    table: Table = Table.create();
    message: string = Store.getSync('message');

    created() {
        Store.clear('message');
        this.configureTable();

        // Platforms come from the API, so their filter is added once they are loaded.
        Platform.list()
            .then(platforms => this.table.setFilters([...this.baseFilters(), {
                type: 'select',
                name: 'platform_id',
                label: $t('game.filters.platform'),
                width: 180,
                props: { options: platforms.map(p => ({ value: String(p.id), content: p.name })), required: false },
            }]))
            .catch(() => { /* the rest of the filters still work */ });
    }

    yesNo(): IOption[] {
        return [
            { value: '1', content: $t('generic.yes') },
            { value: '0', content: $t('generic.no') },
        ];
    }

    baseFilters(): TableFilter[] {
        const yesNoSelect = (name: string, label: string): TableFilter => ({
            type: 'select', name, label, width: 150, props: { options: this.yesNo(), required: false },
        });

        return [
            { type: 'text', name: 'publisher', label: $t('game.labels.publisher'), width: 180 },
            { type: 'text', name: 'developer', label: $t('game.labels.developer'), width: 180 },
            { type: 'number', name: 'year_from', label: $t('game.filters.yearFrom'), width: 120 },
            { type: 'number', name: 'year_to', label: $t('game.filters.yearTo'), width: 120 },
            yesNoSelect('hidden', $t('game.labels.hidden')),
            yesNoSelect('story', $t('game.labels.story')),
            yesNoSelect('achievements', $t('game.labels.achievements')),
            yesNoSelect('manual', $t('game.filters.manual')),
            {
                type: 'select',
                name: 'missing',
                label: $t('game.filters.missing'),
                width: 180,
                props: {
                    required: false,
                    options: ['icon', 'logo', 'publisher', 'developer', 'year', 'genres']
                        .map(field => ({ value: field, content: $t(`game.filters.missingOptions.${field}`) })),
                },
            },
        ];
    }

    configureTable() {
        this.table
            .gridlines()
            .setFilters(this.baseFilters())
            .fetch(resolve => {
                const params: any = {
                    search: this.table.filters.search,
                    offset: this.table.offset,
                    pageSize: this.table.pageSize,
                };
                for (const key of FILTER_KEYS) {
                    const value = this.table.filters[key];
                    if (value !== undefined && value !== null && value !== '') params[key] = value;
                }
                if (this.table.sort) {
                    params.sort_by = this.table.sort.by;
                    params.sort_order = this.table.sort.order.toLowerCase();
                }

                Game.list(params).then(response => {
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
                    sortable: true,
                    value: (item: Game) => item.year ? String(item.year).slice(0, 4) : '',
                },
                {
                    header: $t('game.labels.publisher'),
                    name: 'publisher',
                    sortable: true,
                },
                {
                    header: $t('game.labels.developer'),
                    name: 'developer',
                    sortable: true,
                },
                {
                    header: $t('game.labels.platforms'),
                    name: 'platform_names',
                    value: (item: Game) => (item.platform_names || []).join(', '),
                },
                {
                    header: $t('game.labels.achievements'),
                    name: 'achievements_count',
                    sortable: true,
                    value: (item: Game) => String(item.achievements_count ?? 0),
                },
                {
                    header: $t('game.labels.story'),
                    name: 'has_story_achievement',
                    sortable: true,
                    value: (item: Game) => item.has_story_achievement ? $t('generic.yes') : $t('generic.no'),
                },
                {
                    header: $t('game.labels.hidden'),
                    name: 'hide',
                    sortable: true,
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
