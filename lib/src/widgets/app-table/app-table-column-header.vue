<template>
    <div v-if="table && col">
        <component v-if="col.header && col.header.component" :is="col.header.component"
            v-bind="col.header.props ? col.header.props : {}" />

        <slot v-else-if="hasSlot('header-' + col.name)" :col="col" />

        <div v-else v-safe-html="col.header" />

        <div class="header-search" @click.stop>
            <slot v-if="col.search && hasSlot('search-' + col.name)" :name="'search-' + col.name" :col="col" :search="{
                complete: (value: any) => col.search(value)
            }" />
            <FormInput type="search" v-else-if="col.search" v-model="table.filters[col.name]"
                @stop="col.search(table.filters[col.name])" :placeholder="$t('generic.search') + '...'" />
            <div v-else-if="hasAtLeastOneSearch()" class="header-search-placeholder"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import FormInput from '../form-input/form-input.vue';

export default defineComponent({

    components: {
        FormInput
    },

    props: {
        table: {
            type: Object as PropType<Table>
        },
        col: {
            type: Object as PropType<any>
        }
    },

    methods: {
        hasAtLeastOneSearch() {
            if (!this.table) return false;
            return this.table.columns.some(c => c.search);
        }
    }

});
</script>