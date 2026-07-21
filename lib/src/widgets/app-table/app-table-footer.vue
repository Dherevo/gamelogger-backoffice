<template>
    <div class="app-table-footer flex-row" v-if="table">

        <div className="flex-grow">
            <Paginator v-if="table._paginator &&
                (table.items && table.items.length
                    && table._paginator.totalResults > table._paginator.pageSize)
                || (table._paginator && table._paginator.structure.has('RowsPerPageDropdown'))"
                v-model:first="paginatorFirst" :rows="table._paginator.pageSize"
                :totalRecords="table._paginator.totalResults"
                :template="table._paginator ? table._paginator.structure.toString() : undefined"
                :rowsPerPageOptions="table._paginator ? table._paginator.structure.perPageOptions : undefined"
                @page="onPageChange($event)"
                :currentPageReportTemplate="table._paginator ? table._paginator.structure.textTemplate : undefined" />
        </div>

        <AppTableExport :table="table" />

    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import Paginator from 'primevue/paginator';
import AppTableExport from './app-table-export.vue';
import Popup from '../popup/popup.vue';

export default defineComponent({

    components: {
        Paginator,
        AppTableExport,
        Popup
    },

    props: {
        table: {
            type: Object as PropType<Table>
        }
    },

    data() {
        const data : {
            paginatorFirst: number
        } = {
            paginatorFirst: 0
        }
        return data;
    },

    methods: {
        onPageChange($e: any) {
            this.table!._paginator.pageSize = $e.rows;
            this.table!.page = $e.page + 1;
            this.table!.refresh();
        }
    }

});
</script>