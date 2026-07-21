<template>
    <Popup v-if="table && table._useVisibility"
        class="visibility-button" 
        icon="tabler/eye-cog" 
        :autoClose="true"
        :onOpen="() => $emit('open')">

        <template #content>
            <div class="app-table-visibility-popup">

                <FormInput type="search" :placeholder="$t('generic.search')" v-model="visibilitySearch" />

                <template v-for="(col, index) in table.columns" :key="index">

                    <FormInput type="checkbox" v-if="
                        (col.name.toLowerCase().includes(visibilitySearch.toLowerCase()))
                        ||
                        (typeof col.header == 'string'
                            && col.header.toLowerCase().includes(visibilitySearch.toLowerCase()))
                    " 
                    :label="col.header as string" 
                    :modelValue="col.visible !== false"
                    @update:modelValue="col.visible = $event" />

                </template>

            </div>
        </template>
    </Popup>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import Popup from '../popup/popup.vue';
import FormInput from '../form-input/form-input.vue';

export default defineComponent({

    components: {
        Popup,
        FormInput
    },

    props: {
        table: {
            type: Object as PropType<Table>
        },
        open: {
            type: Boolean
        }
    },

    emits: ['open'],

    data() {
        return {
            visibilitySearch: ''
        }
    }

});
</script>