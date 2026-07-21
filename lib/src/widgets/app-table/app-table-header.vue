<template>
    <div v-if="table && table.title" class="app-table-header">

        <h1>{{ table.title }}</h1>

        <div class="results" v-if="table._paginator && table._paginator.totalResults"
            style="margin-bottom: 5px;">
            <AnimatedNumber v-model="table._paginator.totalResults" /> {{ $t('generic.results') }}
        </div>

        <div class="flex-grow" />

        <slot name="header-actions" />

    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import AnimatedNumber from '../animated-number/animated-number.vue';

export default defineComponent({

    components: {
        AnimatedNumber,
    },

    props: {
        table: {
            type: Object as PropType<Table>
        }
    }

});
</script>