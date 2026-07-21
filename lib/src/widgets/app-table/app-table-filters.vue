<template>
    <div class="app-table-filters" v-if="table">

        <div class="filters-row flex-top-left">

            <div class="filters flex-grow">

                <template v-if="table.tableFilters && table.tableFilters.length > 0">
                    <div v-for="(filter, index) in table.tableFilters" :key="index"
                        :style="{ flex: `0 0 ${getFilterWidth(filter)}px` }">

                        <slot :name="`filter-${filter.name}`" v-if="filter.type == 'custom'"></slot>

                        <FormInput :type="filter.type"
                            :label="filter.label"
                            v-bind="filter.props ?? {}"
                            v-model="table.filters[filter.name]"
                            @update:modelValue="checkIfShouldRefresh('change', filter)"
                            @stop="checkIfShouldRefresh('stop', filter)" />
                    </div>
                </template>

                <slot name="filters" />

                <Btn nude v-if="table.tableFiltersAutomatic"  
                    class="clear-filters" 
                    style="margin-bottom: 5px"
                    @click="clearFilters()">
                        <SvgIcon name="tabler/reload" />
                        {{ $t('table.clearFilters') }}
                    </Btn>

            </div>

            <div class="flex-col-top-center" v-if="!table.tableFiltersAutomatic">
                <Btn @click="table.refresh()">
                    <SvgIcon name="ionic/filter" />
                    {{ $t('table.applyFilters') }}
                </Btn>

                <Btn nude class="clear-filters" @click="clearFilters()">
                    <SvgIcon name="tabler/reload" />
                    {{ $t('table.clearFilters') }}
                </Btn>
            </div>

        </div>

    </div>
</template>

<style lang="scss">
.app-table {
    .app-table-filters {

        .filters {
            display: flex;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 15px
        }

        .btn.clear-filters {
            margin-top: 5px;
            font-size: .8rem;
        }
    }
}
</style>

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
        }
    },

    created() {
        this.setDefaultFilters();
    },

    methods: {
        getFilterWidth(filter: any) {
            if (filter.width) {
                return filter.width;
            }

            if (filter.type == 'search') {
                return 300;
            }

            return 200;
        },

        setDefaultFilters() {
            if (this.table && this.table.tableFilters) {
                for (const filter of this.table.tableFilters) {
                    if (filter.default) {
                        this.table.filters[filter.name] = filter.default;
                    }
                }
            }
        },

        clearFilters() {
            const page = this.table?.filters?.page ?? undefined;
            this.table!.filters = page ? { page } : {};
            this.setDefaultFilters();

            this.$forceUpdate();
            if (this.table?.tableFiltersAutomatic) {
                this.table!.refresh();
            }
        },

        checkIfShouldRefresh(eventType: 'change'|'stop', filter: any) {
            if (!this.table) return;
            if (!this.table.tableFiltersAutomatic) return;

            if (['search', 'text', 'number', 'textarea'].includes(filter.type)) {
                if (eventType == 'change') return;
            }
            else if (eventType == 'stop') return;

            this.table.refresh();
        }
    }

});
</script>