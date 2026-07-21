<template>
    <Popup v-if="table && table._exportable" :autoClose="true" expand="top" class="export-popup">

        <template #button>
            <Btn class="export-btn">
                <span>{{ $t('generic.export') }}</span>
                <SvgIcon name="prime/chevron-up" style="width: 30px;height: 30px" />
            </Btn>
        </template>

        <template #content>
            <div className="export-options">
                <ul>
                    <li @click="() => table && table._exportable && table._exportable('csv')">CSV</li>
                    <li @click="() => table && table._exportable && table._exportable('excel')">Excel</li>
                    <li @click="() => table && table._exportable && table._exportable('pdf')">PDF</li>
                    <li @click="() => table && table._exportable && table._exportable('print')">{{ $t('generic.print')
                        }}</li>
                </ul>
            </div>
        </template>

    </Popup>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import Popup from '../popup/popup.vue';

export default defineComponent({

    components: {
        Popup
    },

    props: {
        table: {
            type: Object as PropType<Table>
        }
    },

    methods: {
        exportCSV() {
            const t = this.table?._ref;
            if (!t) return;
            t.exportCSV();
        },
    }

});
</script>