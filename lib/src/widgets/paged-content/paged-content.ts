import { PropType, defineComponent } from 'vue';
import Table from '../app-table/table';
import Paginator from 'primevue/paginator';

export default defineComponent({

    components: { Paginator },

    props: {
        table: {
            type: Object as PropType<Table>
        },
        grid: {
            type: Object as PropType<any>
        },
        emptyMessage: {
            type: String
        }
    },

    data() {
        const data : {
            paginatorFirst: number,
        } = {
            paginatorFirst: 0
        }

        return data;
    },

    watch: {
        table() {
            if (!this.table) return;
            this.initTable();
        }
    },

    created() {
        this.initTable();
    },

    methods: {
        initTable() {
            if (!this.table) return;
            this.table.refresh();
        },
        onPageChange($e: any) {
            this.table!._paginator.pageSize = $e.rows;
            this.table!.page = $e.page + 1;
            this.table!.refresh();
        }
    }

});