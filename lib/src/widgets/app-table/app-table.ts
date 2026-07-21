
import { defineComponent, PropType } from 'vue';
import Loader from '../loader/loader.vue';
import Table, { TableColumn } from './table';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import MirrorScroll from '../mirror-scroll/mirror-scroll.vue';
import Link from '../link/link.vue';
import AppTableHeader from './app-table-header.vue';
import AppTableBulkActions from './app-table-bulk-actions.vue';
import AppTableFooter from './app-table-footer.vue';
import AppTableColumnHeader from './app-table-column-header.vue';
import AppTableColumnBody from './app-table-column-body.vue';
import AppTableRowOptions from './app-table-row-options.vue';
import AppTableColumnsVisibility from './app-table-columns-visibility.vue';
import AppTableFilters from './app-table-filters.vue';

export default defineComponent({

    components: { 
        Loader, 
        DataTable, 
        Column, 
        Paginator, 
        MirrorScroll,
        Link,
        AppTableHeader,
        AppTableBulkActions,
        AppTableFooter,
        AppTableColumnHeader,
        AppTableColumnBody,
        AppTableRowOptions,
        AppTableColumnsVisibility,
        AppTableFilters
    },

    props: {
        table: {
            type: Object as PropType<Table>
        }
    },

    data() {
        const data : {
            oldTable : null | Table,
            loading: boolean,
            paginatorFirst: number,
            lockedHeight: string,
            editItem: any,
            editCol?: TableColumn,
            editValue: string,
            visibilityOpen: boolean,
            // Sirve para no ejecutar el evento de click en la fila cuando hemos clicado las opciones
            wasItemOptionsClicked: boolean
        } = {
            oldTable: null,
            loading: false,
            paginatorFirst: 0,
            lockedHeight: '',
            editItem: undefined,
            editCol: undefined,
            editValue: '',
            visibilityOpen: false,
            wasItemOptionsClicked: false
        }
        return data;
    },

    mounted() {
        if (this.table) {
            this.updateReference();
        }
    },

    updated() {
        if (!this.table) return;
        if (this.table == this.oldTable) return;
        this.updateReference();
    },

    methods: {

        hasSlot(name: string) {
            return !!this.$slots[name];
        },
        updateReference() {
            if (!this.table) return;
            this.table.setReference(this);
            this.oldTable = this.table;
            this.table.refresh();
        },
        onRowReorder($event: any) {
            if (!this.table) return;
            if (!this.table.items) return;

            const s = $event.dragIndex;
            const e = $event.dropIndex;

            if (s == e) return;

            const item = this.table.items.splice(s, 1)[0];

            this.table.items.splice(
                e,
                0,
                item
            )

            this.table!._draggable!({
                from: s, to: e
            });
        },

        rowStyle(data: any) {
            if (!this.table || !this.table.items) {
                return {}
            }
            return {
                position: 'relative',
                'z-index': this.table.items.length - this.table.items.indexOf(data)
            }
        },

        columnClass(col: TableColumn) {
            const obj : any = {}

            if (col.overflow == 'dots') {
                obj['text-ellipsis'] = true;
            }

            if (col.class) {
                obj[col.class] = true;
            }

            return obj;
        },

        columnStyle(col: TableColumn) {
            const obj : any = {}

            if (col.width) {
                obj['width'] = col.width + 'px';
                obj['min-width'] = col.width + 'px';
            }

            if (col.overflow && col.overflow != 'none') {
                if (col.overflow == 'hidden') {
                    obj['overflow'] = 'hidden';
                }
                else if (col.overflow == 'scroll') {
                    obj['overflow'] = 'auto';
                }
                if (col.width) obj['max-width'] = col.width + 'px';
            }

            return obj;
        },

        lockTableHeight() {
            const ref = this.ref('tableRef');
            if (!ref) return;

            const h = ref.$el.clientHeight;
            this.lockedHeight = (h * 1.12) + 'px';
        },
        unlockTableHeight() {
            this.lockedHeight = '';
        },

        _clickedRow($event: any, double: boolean = false) {
            if (!this.table) return;
            const items = this.table.items;
            if (!items) return;
            if ($event >= items.length) return;
            if (this.wasItemOptionsClicked) return;
            if (!this.table._onClickRowListener) return;
            this.table._onClickRowListener(items[$event], double, $event);
        },

        _endEdit(_: boolean = true) {
            this.editItem = undefined;
            this.editValue = '';
            this.editCol = undefined;
        },

        startEdit(item: any, col: any) {
            this.editItem = item;
            this.editCol = col;
            this.editValue = item[col.name];
        },

        itemOptionsClicked() {
            this.wasItemOptionsClicked = true;

            setTimeout(() => {
                this.wasItemOptionsClicked = false;
            }, 20);
        },
    }

})