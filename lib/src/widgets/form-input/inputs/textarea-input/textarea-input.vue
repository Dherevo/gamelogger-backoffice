<template>
    <template v-if="!isReadonly()" >
    <Textarea ref="input"
        :modelValue="modelValue"
        v-bind="inputProps"
        :id="name"
        :autoResize="autoResize"
        autocomplete="off"
        @input="updateValue($event)" 
        :disabled="disabled"
        :placeholder="placeholder"
        :maxlength="max"
        @keydown.esc="passEmit('pressEscape')"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keyup="passEmit('keyup', $event)"/>

        <div class="length-counter" :class="{
            overpassed: (modelValue ?? '').length > max
        }" v-if="max">{{ (modelValue ?? '').length + ' / ' + max }}</div>
    </template>

    <div v-else class="readonly-value" v-safe-html="modelValue"/>
</template>

<script lang="ts" src="./textarea-input.ts"></script>
<style lang="scss" src="./textarea-input.scss"></style>