<template>
    <div class="searchbar" v-if="!isReadonly()">

        <AutoComplete
            ref="input"
            :inputId="name"
            v-bind="inputProps"
            :dropdown="false"
            :modelValue="modelValue" 
            :forceSelection="false"
            @input="updateValue($event.target.value)" 
            :disabled="isDisabled()" 
            :placeholder="placeholder ?? $t('generic.search')"
            :suggestions="previousSuggestions"
            @item-select="suggestionSelected($event.value)"
            optionLabel="content"
            :optionGroupLabel="undefined" 
            optionGroupChildren="items"
            @dropdown-click="onOpenSuggestions()" 
            @keydown.enter="passEmit('pressEnter')"
            @keydown.tab="passEmit('pressTab')"
            @keydown.esc="passEmit('pressEscape')"
            @hide="onCloseSuggestions()"
            @blur="passEmit('blur', modelValue)"
            @focus="passEmit('focus', modelValue)">
            <template #optiongroup="{ option }">
                <div v-if="!option.component" v-safe-html="option.content ? option.content : option.value"/>
                <component v-else :is="option.component" v-bind="option.props ? option.props : {}"/>
            </template>
            <template #option="{ option }">
                <slot v-if="hasSlot('option')" name="option" :option="option" />
                <div v-else-if="!option.component" v-safe-html="option.content ? option.content : option.value"/>
                <component v-else :is="option.component" v-bind="option.props ? option.props : {}"/>
            </template>
        </AutoComplete>

        <SvgIcon name="prime/search" class="search-icon" @click="submit()"/>
    </div>
</template>

<script lang="ts" src="./search-input.ts"></script>
<style lang="scss" src="./search-input.scss"></style>