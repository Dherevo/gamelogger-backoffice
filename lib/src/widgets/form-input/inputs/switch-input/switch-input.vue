<template>
    <ToggleSwitch v-if="!isReadonly()" 
        :modelValue="modelValue" 
        @click="interceptClick"
        @change="updateValue($event)" 
        :inputId="name"
        :disabled="isDisabled()"
        v-bind="inputProps"
        @focus="passEmit('focus', $event)"
        @blur="passEmit('blur', $event)" />

    <BooleanIcon v-else
        :value="modelValue" />
</template>

<script lang="ts" src="./switch-input.ts"></script>
<style lang="scss" src="./switch-input.scss"></style>