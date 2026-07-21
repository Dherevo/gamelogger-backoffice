<template>
    <div class="bulk-actions" v-if="table && table._bulkActions && table._bulkActions.length > 0 && table.selectedItems.length > 0">
        
        <div class="count">{{ $t('table.count_selected', {count: table?.selectedItems.length}) }}</div>

        <Btn nude v-for="(action, index) in table._bulkActions" :key="index" @click="action.onClick()">
            <SvgIcon :name="action.icon" v-if="action.icon && action.iconPosition != 'right'"/>
            {{ action.content }}
            <SvgIcon :name="action.icon" v-if="action.icon && action.iconPosition == 'right'"/>
        </Btn>

    </div>
</template>

<style lang="scss">
.app-table {
    .bulk-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 15px;

        .count {
            font-size: .9rem;
        }

        .btn {
            font-weight: normal;
            padding: 5px 10px;

            .btn-content {
                gap: 5px;
                font-size: .8rem;
            }
        }
    }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';

export default defineComponent({

    props: {
        table: {
            type: Object as PropType<Table>
        }
    }

});
</script>