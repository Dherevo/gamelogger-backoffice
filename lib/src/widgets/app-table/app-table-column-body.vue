<template>
    <template v-if="table && col">
        <!-- When is not editable, just display the content -->
        <template v-if="!_isEditable(item)">
            <template v-if="!hasSlot('col-' + col.name)">
                <div v-if="col.value" v-html="col.value(item, index)" />
                <component v-else-if="col.component" :is="col.component"
                    v-bind="col.props ? col.props(item, index) : {}" />
                <div v-else v-html="item[col.name]" />
            </template>
            <slot v-else :name="'col-' + col.name" :item="item" />
        </template>

        <!-- When it is editable, show the edit component -->
        <template v-else>
            <div v-if="editItem == item && editCol == col" class="flex-row table-inline-edit editable">
                <slot v-if="hasSlot('edit-' + col.name)" :name="'edit-' + col.name" :item="item" :value="editValue"
                    :setValue="(v: any) => $emit('update:editValue', v)" />

                <input v-else ref="editInput" v-model="editValue" @keyup.enter="_endEdit(true)"
                    @keyup.esc="_endEdit(false)">

                <svg-icon name="heroicons-solid/x-circle" @click.stop="_endEdit(false)" />
                <svg-icon name="heroicons-solid/check-circle" @click.stop="_endEdit(true)" />
            </div>

            <div v-else class="flex-row gap-5 table-inline-edit no-editable" @click.stop="startEdit()">
                <template v-if="!hasSlot('col-' + col.name)">
                    <div v-if="col.value" v-html="col.value(item, index)" />
                    <component v-else-if="col.component" :is="col.component"
                        v-bind="col.props ? col.props(item, index) : {}" />
                    <div v-else v-html="item[col.name]" />
                </template>
                <slot v-else :name="'col-' + col.name" :item="item" />
                <svg-icon name="heroicons-solid/pencil" class="edit-icon" />
            </div>
        </template>
    </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';

export default defineComponent({

    props: {
        table: {
            type: Object as PropType<Table>
        },
        col: {
            type: Object as PropType<any>
        },
        item: {
            type: Object as PropType<any>
        },
        index: {
            type: Number
        },
        editItem: {},
        editCol: {},
        editValue: {}
    },

    emits: ['update:editValue', 'startEdit', 'stopEdit'],

    methods: {
        _isEditable(item: any) {
            if (!this.col.edit) return false;
            const r = this.col.edit(item);
            return r !== undefined;
        },

        _endEdit(save: boolean = true) {

            const col: any = this.editCol!;
            const object: any = this.editItem!;

            if (save) {
                object[col.name] = this.editValue;
            }

            this.$emit('stopEdit', save);

            if (save) {
                if (!col.edit) return;

                const r = col.edit(object);
                if (r) {
                    r(object[col.name]);
                }
            }
        },

        startEdit() {
            this.$emit('startEdit')

            setTimeout(() => {
                let r = this.ref('editInput');
                if (!r || (Array.isArray(r) && r.length == 0)) return;
                if (Array.isArray(r)) r = r[0];
                r.focus();
            });
        },
    }

});
</script>