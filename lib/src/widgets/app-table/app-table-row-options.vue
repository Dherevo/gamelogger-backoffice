<template>
    <template v-if="table && table.items && options.length > 0">
        <div @click="$emit('clicked')" v-if="table._itemOptionsMode == 'alwaysPopup'
            || (table._itemOptionsMode == 'singleIconMultiplePopup' && options.length > 1)
            || (table._itemOptionsMode == 'singleButtonMultiplePopup' && options.length > 1)">

            <Popup :style="{
                'max-width': '50px'
            }" :autoClose="true" class="p-datatable-itemoptions-popup"
                :expand="index >= table.items.length / 2 ? 'top' : 'bottom'">
                <template #content>
                    <ul class="p-datatable-itemoptions-menu">

                        <template v-for="(option, index) of options" :key="index">

                            <li class="flex-row gap-5 p-datatable-itemoptions-menu-item" v-if="option.command"
                                @click="option.command()">
                                <svg-icon v-if="option.icon" :name="option.icon" />
                                <div>{{ option.label }}</div>
                            </li>

                            <li class="flex-row gap-5 p-datatable-itemoptions-menu-item" v-else>
                                <Link :href="option.link">
                                <svg-icon v-if="option.icon" :name="option.icon" />
                                <div>{{ option.label }}</div>
                                </Link>
                            </li>

                        </template>

                    </ul>
                </template>
            </Popup>

        </div>

        <div v-else-if="table._itemOptionsMode == 'alwaysIcons' ||
            (table._itemOptionsMode == 'singleIconMultiplePopup' && options.length == 1)"
            class="flex-row gap-5 p-datatable-itemoptions-icons" ref="itemActionButtonsCol"
            :style="forceItemActionsColumnWidth()">

            <template v-for="(item, index) in options" :key="index">

                <SvgIcon v-if="!item.label" class="itemoption-icon" :name="item.icon" @click="item.command($event)" />
                <Tooltip v-else :text="item.label">
                    <SvgIcon class="itemoption-icon" :name="item.icon" @click="item.command($event)" />
                </Tooltip>

            </template>

        </div>

        <div v-else-if="table._itemOptionsMode == 'alwaysButtons' ||
            (table._itemOptionsMode == 'singleButtonMultiplePopup' && options.length == 1)"
            class="flex-row gap-5 p-datatable-itemoptions-buttons" ref="itemActionButtonsCol"
            :style="forceItemActionsColumnWidth()">

            <template v-for="(item, index) in options" :key="index">

                <btn v-if="!item.label" @click="item.command($event)" class="itemoption-btn">
                    <svg-icon v-if="item.icon" :name="item.icon" />
                    <div v-if="item.label">{{ item.label }}</div>
                </btn>
                <Tooltip v-else :text="item.label">
                    <btn v-for="(item, index) in options" :key="index" @click="item.command($event)"
                        class="itemoption-btn">
                        <svg-icon v-if="item.icon" :name="item.icon" />
                        <div v-if="item.label">{{ item.label }}</div>
                    </btn>
                </Tooltip>

            </template>

        </div>
    </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Table from './table';
import Popup from '../popup/popup.vue';
import Tooltip from '../tooltip/tooltip.vue';

export default defineComponent({

    components: {
        Popup,
        Tooltip
    },

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
            type: Number,
            required: true
        }
    },

    emits: ['clicked'],

    data() {
        const data : {
            options: any[]
        } = {
            options: []
        }
        return data;
    },

    created() {
        this.options = this.getItemOptions();
    },

    methods: {
        getItemOptions() {
            if (!this.table) return [];
            if (!this.table.itemOptions) return [];
            if (!this.col) return [];

            if (!this.col._itemActions)
                this.col['_itemActions'] = {};

            if (this.col._itemActions[this.index])
                return this.col._itemActions[this.index];

            this.col._itemActions[this.index] = this.table.itemOptions(this.item);
            return this.col._itemActions[this.index] ?? [];
        },

        forceItemActionsColumnWidth() {

            setTimeout(() => {

                const ref: any = this.$refs.itemActionButtonsCol;
                const elements: HTMLElement[] = Array.isArray(ref) ? ref : [ref];

                for (const e of elements) {
                    const td = e.parentElement;

                    if (!td) continue;
                    if (td.style.width) continue;
                    td.style.width = e.clientWidth + 'px';
                }

            });

            return {};
        }
    }

});
</script>