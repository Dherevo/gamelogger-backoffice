<template>
    <Checkbox v-if="!isReadonly()" 
        :modelValue="modelValue" 
        :checked="modelValue"
        @click="updateValue(!modelValue)" 
        :disabled="isDisabled()"
        :binary="true"
        :inputId="inputName"
        v-bind="inputProps"/>
    
    <BooleanIcon v-else
        :value="modelValue" />
</template>

<script lang="ts" src="./checkbox-input.ts"></script>
<style lang="scss" src="./checkbox-input.scss"></style>