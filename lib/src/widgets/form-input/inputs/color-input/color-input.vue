<template>
    <ColorPicker v-if="!isReadonly()" 
        :modelValue="modelValue" 
        @update:modelValue="updateValue($event)"
        :inputId="name"
        :inline="inline"
        :disabled="isDisabled()"
        v-bind="inputProps"/>

    <div v-else
    class="readonly-value flex-row gap-5">
        <span :style="{
            width: '20px',
            height: '20px',
            'background-color': '#'+modelValue,
            'border-radius': '3px'
        }"/>
        <span>#{{ modelValue }}</span>
    </div>
</template>

<style lang="scss">
.form-input.type-color {
    display: flex;

    label {
        flex: 1;
    }

    .p-colorpicker {
        width: 30px;
    }
}

.p-colorpicker-panel {
    z-index: 9999;
}
</style>

<script lang="ts" src="./color-input.ts"></script>