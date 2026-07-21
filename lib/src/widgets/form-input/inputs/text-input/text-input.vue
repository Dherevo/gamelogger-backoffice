<template>
    <template v-if="!isReadonly()">

    <InputNumber v-if="type == 'number'" 
        :modelValue="modelValue" 
        @input="updateValue($event.value)" 
        :disabled="isDisabled()"
        ref="input"
        fluid
        :inputId="name"
        :min="min"
        :max="max"
        :prefix="prefix"
        :suffix="suffix"
        :useGrouping="autoformat"
        :minFractionDigits="decimals === undefined ? (currency ? 2 : 0) : decimals"
        :maxFractionDigits="decimals === undefined ? (currency ? 2 : 0) : decimals"
        :mode="currency ? 'currency' : undefined"
        :currency="currency"
        :show-buttons="showButtons"
        v-bind="inputProps"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keydown.esc="passEmit('pressEscape')"
        @keyup="passEmit('keyup', $event)"
        @blur="numberBlur($event)"
        @focus="passEmit('focus', $event)"/>

    <InputMask v-else-if="mask" 
        :mask="mask"
        :modelValue="modelValue" 
        @update:modelValue="updateValue($event)" 
        :placeholder="placeholder"
        :disabled="isDisabled()"
        :autocomplete="autocomplete"
        :name="name"
        :type="type"
        translate="no"
        autocorrect="off"
        :id="name"
        ref="input"
        v-bind="inputProps"
        @complete="passEmit('complete', modelValue)"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keydown.esc="passEmit('pressEscape')"
        @keyup="passEmit('keyup', $event)"
        @blur="passEmit('blur', $event)"
        @focus="passEmit('focus', $event)"/>

    <AutoComplete v-else-if="suggestions" 
        ref="input"
        v-bind="inputProps"
        :inputId="name"
        :dropdown="false"
        :modelValue="modelValue" 
        :forceSelection="false"
        @input="updateValue($event.target.value)" 
        :disabled="isDisabled()" 
        :placeholder="placeholder"
        :suggestions="previousSuggestions"
        @item-select="suggestionSelected($event.value)"
        optionLabel="content"
        :optionGroupLabel="undefined" 
        optionGroupChildren="items"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keydown.esc="passEmit('pressEscape')"
        @dropdown-click="onOpenSuggestions()" 
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

    <InputText v-else
        :modelValue="modelValue" 
        @input="updateValue($event?.target?.value)" 
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :name="name"
        :type="type"
        :id="name"
        ref="input"
        translate="no"
        autocorrect="off"
        :maxlength="max"
        v-bind="inputProps"
        :inputmode="type == 'email' ? 'email' : 'text'"
        @keydown.enter="passEmit('pressEnter')"
        @keydown.tab="passEmit('pressTab')"
        @keydown.esc="passEmit('pressEscape')"
        @keyup="passEmit('keyup', $event)"
        @blur="passEmit('blur', $event)"
        @focus="passEmit('focus', $event)"/>

        <div class="length-counter" 
        v-if="type != 'number' && !mask && max"
        :class="{
            overpassed: getLength() > max
        }">{{ getLength() + ' / ' + max }}</div>

    </template>
    <div v-else class="readonly-value">{{ modelValue }}</div>
</template>

<script lang="ts" src="./text-input.ts"></script>
<style lang="scss" src="./text-input.scss"></style>